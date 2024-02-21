"use client"

import { useState } from "react"
import {
  AddressTrustlessManagement,
  OptimisticPaymentsDecimals,
  OptimsticActionsRole,
} from "@/contracts/OptimisticActionsManagement"
import { VerifiedContributorTagTrustlessManagementContract } from "@/contracts/VerifiedContributorTagTrustlessManagement"
import { OptimisticActionsContract } from "@/ovc-indexer/contracts/OptimisticActions"
import { TasksContract } from "@/ovc-indexer/openrd-indexer/contracts/Tasks"
import { Task } from "@/ovc-indexer/openrd-indexer/types/tasks"
import { addToIpfs } from "@/ovc-indexer/openrd-indexer/utils/ipfs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Address,
  BaseError,
  ContractFunctionRevertedError,
  encodeFunctionData,
} from "viem"
import { usePublicClient, useWalletClient } from "wagmi"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

import { Checkbox } from "../ui/checkbox"
import { RichTextArea } from "./rich-textarea"
import { defaultChain } from "./web3-provider"

const formSchema = z.object({
  title: z.string(),
  description: z.string(),
  amount: z.coerce.number(),
  increaseBudget: z.boolean(),
  budgetIncrease: z.coerce.number(),
  extendDeadline: z.boolean(),
  deadlineExtension: z.coerce.number(),
})

export function CreateOptimisticPayment({
  dao,
  role,
  taskId,
  task,
  refresh,
}: {
  dao: Address
  role: bigint
  taskId: bigint
  task?: Task
  refresh: () => Promise<void>
}) {
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      amount: 0,
      increaseBudget: false,
      budgetIncrease: 0,
      extendDeadline: false,
      deadlineExtension: 0,
    },
  })

  const [submitting, setSubmitting] = useState<boolean>(false)
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (submitting) {
      toast({
        title: "Please wait",
        description: "The past submission is still running.",
        variant: "destructive",
      })
      return
    }

    const submit = async () => {
      setSubmitting(true)
      let { dismiss } = toast({
        title: "Creating payment request",
        description: "Uploading metadata to IPFS...",
      })

      const metadata = {
        title: values.title,
        description: values.description,
      }
      const cid = await addToIpfs(JSON.stringify(metadata)).catch((err) => {
        console.error(err)
        return undefined
      })
      if (!cid) {
        dismiss()
        toast({
          title: "Payment request creation failed",
          description: "Could not upload metadata to IPFS.",
          variant: "destructive",
        })
        return
      }
      console.log(`Sucessfully uploaded payment metadata to ipfs: ${cid}`)

      dismiss()
      dismiss = toast({
        title: "Generating transaction",
        description: "Please sign the transaction in your wallet...",
      }).dismiss

      if (!publicClient || !walletClient) {
        dismiss()
        toast({
          title: "Payment request creation failed",
          description: `${publicClient ? "Wallet" : "Public"}Client is undefined.`,
          variant: "destructive",
        })
        return
      }
      let actions = [
        {
          to: TasksContract.address,
          value: BigInt(0),
          data: encodeFunctionData({
            abi: TasksContract.abi,
            functionName: "partialPayment",
            args: [
              taskId,
              [],
              [
                BigInt(values.amount) *
                  BigInt(10) ** BigInt(OptimisticPaymentsDecimals),
              ],
            ],
          }),
        },
      ]
      if (values.increaseBudget) {
        actions.push(
          {
            to: TasksContract.address,
            value: BigInt(0),
            data: encodeFunctionData({
              abi: TasksContract.abi,
              functionName: "increaseBudget",
              args: [
                taskId,
                [
                  BigInt(values.budgetIncrease) *
                    BigInt(10) ** BigInt(OptimisticPaymentsDecimals),
                ],
              ],
            }),
          },
          {
            to: TasksContract.address,
            value: BigInt(0),
            data: encodeFunctionData({
              abi: TasksContract.abi,
              functionName: "increaseReward",
              args: [
                taskId,
                task?.executorApplication ?? 0,
                [],
                [
                  BigInt(values.budgetIncrease) *
                    BigInt(10) ** BigInt(OptimisticPaymentsDecimals),
                ],
              ],
            }),
          }
        )
      }
      if (values.extendDeadline) {
        actions.push({
          to: TasksContract.address,
          value: BigInt(0),
          data: encodeFunctionData({
            abi: TasksContract.abi,
            functionName: "extendDeadline",
            args: [taskId, BigInt(values.deadlineExtension * 7 * 24 * 60 * 60)], // in weeks
          }),
        })
      }

      const trustlessAction = {
        to: OptimisticActionsContract.address,
        value: BigInt(0),
        data: encodeFunctionData({
          abi: OptimisticActionsContract.abi,
          functionName: "createAction",
          args: [
            AddressTrustlessManagement,
            OptimsticActionsRole,
            actions,
            BigInt(0),
            `ipfs://${cid}`,
          ],
        }),
      }
      const transactionRequest = await publicClient
        .simulateContract({
          account: walletClient.account.address,
          abi: VerifiedContributorTagTrustlessManagementContract.abi,
          address: VerifiedContributorTagTrustlessManagementContract.address,
          functionName: "asDAO",
          args: [dao, role, [trustlessAction], BigInt(0)],
        })
        .catch((err) => {
          console.error(err)
          if (err instanceof BaseError) {
            let errorName = err.shortMessage ?? "Simulation failed."
            const revertError = err.walk(
              (err) => err instanceof ContractFunctionRevertedError
            )
            if (revertError instanceof ContractFunctionRevertedError) {
              errorName += ` -> ${revertError.data?.errorName}` ?? ""
            }
            return errorName
          }
          return "Simulation failed."
        })
      if (typeof transactionRequest === "string") {
        dismiss()
        toast({
          title: "Payment request creation failed",
          description: transactionRequest,
          variant: "destructive",
        })
        return
      }
      const transactionHash = await walletClient
        .writeContract(transactionRequest.request)
        .catch((err) => {
          console.error(err)
          return undefined
        })
      if (!transactionHash) {
        dismiss()
        toast({
          title: "Payment request creation failed",
          description: "Transaction rejected.",
          variant: "destructive",
        })
        return
      }

      dismiss()
      dismiss = toast({
        duration: 120_000, // 2 minutes
        title: "Payment request transaction submitted",
        description: "Waiting until confirmed on the blockchain...",
        action: (
          <ToastAction
            altText="View on explorer"
            onClick={() => {
              window.open(
                `${defaultChain.blockExplorers.default.url}/tx/${transactionHash}`,
                "_blank"
              )
            }}
          >
            View on explorer
          </ToastAction>
        ),
      }).dismiss

      const receipt = await publicClient.waitForTransactionReceipt({
        hash: transactionHash,
      })

      dismiss()
      dismiss = toast({
        title: "Success!",
        description: "The payment request has been created.",
        variant: "success",
        action: (
          <ToastAction
            altText="Refresh"
            onClick={() => {
              refresh()
            }}
          >
            Refresh
          </ToastAction>
        ),
      }).dismiss
    }

    await submit().catch(console.error)
    setSubmitting(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(change) => {
                    field.onChange(change)
                    form.trigger("title")
                  }}
                />
              </FormControl>
              <FormDescription>
                Employee: start period - end period
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <RichTextArea
                  {...field}
                  onChange={(change) => {
                    field.onChange(change)
                    form.trigger("description")
                  }}
                />
              </FormControl>
              <FormDescription>
                Scope of work performed during the period you are requesting pay
                for.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(change) => {
                    field.onChange(change)
                    form.trigger("amount")
                  }}
                />
              </FormControl>
              <FormDescription>
                How many ERC20 tokens are requested to be paid out.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="increaseBudget"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Checkbox
                  className="mr-1"
                  checked={field.value}
                  onCheckedChange={(change) => {
                    field.onChange(change)
                    form.trigger("increaseBudget")
                  }}
                />
              </FormControl>
              <FormLabel>Increase Budget</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.getValues().increaseBudget && (
          <FormField
            control={form.control}
            name="budgetIncrease"
            render={({ field }) => (
              <FormItem>
                <FormLabel>By</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(change) => {
                      field.onChange(change)
                      form.trigger("budgetIncrease")
                    }}
                  />
                </FormControl>
                <FormDescription>
                  How many ERC20 tokens to increase the budget (top up the
                  escrow) with.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="extendDeadline"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Checkbox
                  className="mr-1"
                  checked={field.value}
                  onCheckedChange={(change) => {
                    field.onChange(change)
                    form.trigger("extendDeadline")
                  }}
                />
              </FormControl>
              <FormLabel>Extend Budget</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.getValues().extendDeadline && (
          <FormField
            control={form.control}
            name="deadlineExtension"
            render={({ field }) => (
              <FormItem>
                <FormLabel>By (weeks)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(change) => {
                      field.onChange(change)
                      form.trigger("budgetIncrease")
                    }}
                  />
                </FormControl>
                <FormDescription>
                  How many weeks to extend the deadline by. The deadline should
                  always be after the expected date to finish the task/contract.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button type="submit" disabled={submitting}>
          Create Optmistic Payment Request
        </Button>
      </form>
    </Form>
  )
}
