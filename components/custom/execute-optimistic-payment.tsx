"use client"

import { useState } from "react"
import { DAOContract } from "@/contracts/DAOContract"
import { VerifiedContributorTagTrustlessManagementContract } from "@/contracts/VerifiedContributorTagTrustlessManagement"
import { OptimisticActionsContract } from "@/ovc-indexer/contracts/OptimisticActions"
import { TasksContract } from "@/ovc-indexer/openrd-indexer/contracts/Tasks"
import { Address, BaseError, ContractFunctionRevertedError } from "viem"
import { usePublicClient, useWalletClient } from "wagmi"

import { errorsOfAbi } from "@/lib/error-decoding"
import { Button } from "@/components/ui/button"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

import { defaultChain } from "./web3-provider"

export function ExecuteOptimisticPayment({
  dao,
  requestId,
  refresh,
}: {
  dao: Address
  requestId: number
  refresh: () => Promise<void>
}) {
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()
  const { toast } = useToast()

  const [executing, setExecuting] = useState<boolean>(false)
  async function execute() {
    if (executing) {
      toast({
        title: "Please wait",
        description: "The past submission is still running.",
        variant: "destructive",
      })
      return
    }

    const submit = async () => {
      setExecuting(true)
      let { dismiss } = toast({
        title: "Generating transaction",
        description: "Please sign the transaction in your wallet...",
      })

      if (!publicClient || !walletClient) {
        dismiss()
        toast({
          title: "Payment execution failed",
          description: `${publicClient ? "Wallet" : "Public"}Client is undefined.`,
          variant: "destructive",
        })
        return
      }

      const transactionRequest = await publicClient
        .simulateContract({
          account: walletClient.account.address,
          abi: [
            ...OptimisticActionsContract.abi,
            ...errorsOfAbi(
              VerifiedContributorTagTrustlessManagementContract.abi
            ),
            ...errorsOfAbi(DAOContract.abi),
            ...errorsOfAbi(TasksContract.abi),
          ],
          address: OptimisticActionsContract.address,
          functionName: "executeAction",
          args: [dao, requestId],
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
          title: "Payment execution failed",
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
          title: "Payment execution failed",
          description: "Transaction rejected.",
          variant: "destructive",
        })
        return
      }

      dismiss()
      dismiss = toast({
        duration: 120_000, // 2 minutes
        title: "Execute transaction submitted",
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
        description: "The payment has been executed.",
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
    setExecuting(false)
  }

  return (
    <Button onClick={() => execute().catch(console.error)}>
      Execute Payment Request
    </Button>
  )
}
