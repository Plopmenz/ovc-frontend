"use client"

import { useState } from "react"
import { VerifiedContributorTagTrustlessManagementContract } from "@/contracts/VerifiedContributorTagTrustlessManagement"
import { OptimisticActionsContract } from "@/ovc-indexer/contracts/OptimisticActions"
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
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

import { RichTextArea } from "./rich-textarea"
import { defaultChain } from "./web3-provider"

const formSchema = z.object({
  reason: z.string(),
})

export function RejectOptimisticPayment({
  dao,
  role,
  requestId,
  refresh,
}: {
  dao: Address
  role: bigint
  requestId: number
  refresh: () => Promise<void>
}) {
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reason: "",
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
        title: "Rejecting payment",
        description: "Uploading metadata to IPFS...",
      })

      const metadata = {
        reason: values.reason,
      }
      const cid = await addToIpfs(JSON.stringify(metadata)).catch((err) => {
        console.error(err)
        return undefined
      })
      if (!cid) {
        dismiss()
        toast({
          title: "Payment rejection failed",
          description: "Could not upload metadata to IPFS.",
          variant: "destructive",
        })
        return
      }
      console.log(
        `Sucessfully uploaded payment rejection metadata to ipfs: ${cid}`
      )

      dismiss()
      dismiss = toast({
        title: "Generating transaction",
        description: "Please sign the transaction in your wallet...",
      }).dismiss

      if (!publicClient || !walletClient) {
        dismiss()
        toast({
          title: "Payment rejection failed",
          description: `${publicClient ? "Wallet" : "Public"}Client is undefined.`,
          variant: "destructive",
        })
        return
      }

      const trustlessAction = {
        to: OptimisticActionsContract.address,
        value: BigInt(0),
        data: encodeFunctionData({
          abi: OptimisticActionsContract.abi,
          functionName: "rejectAction",
          args: [requestId, `ipfs://${cid}`],
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
          title: "Payment rejection failed",
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
          title: "Payment rejection failed",
          description: "Transaction rejected.",
          variant: "destructive",
        })
        return
      }

      dismiss()
      dismiss = toast({
        duration: 120_000, // 2 minutes
        title: "Rejection transaction submitted",
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
        description: "The payment has been rejected.",
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
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason</FormLabel>
              <FormControl>
                <RichTextArea
                  {...field}
                  onChange={(change) => {
                    field.onChange(change)
                    form.trigger("reason")
                  }}
                />
              </FormControl>
              <FormDescription>
                Explenation why you are rejecting this payment request.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button variant="destructive" type="submit" disabled={submitting}>
          Reject Payment Request
        </Button>
      </form>
    </Form>
  )
}
