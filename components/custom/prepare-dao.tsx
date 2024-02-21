"use client"

import { DAOContract } from "@/contracts/DAOContract"
import {
  AddressTrustlessManagement,
  OptimsticActionsRole,
} from "@/contracts/OptimisticActionsManagement"
import { VerifiedContributorTagTrustlessManagementContract } from "@/contracts/VerifiedContributorTagTrustlessManagement"
import { OptimisticActionsContract } from "@/ovc-indexer/contracts/OptimisticActions"
import {
  Address,
  encodeFunctionData,
  keccak256,
  parseAbiItem,
  toBytes,
} from "viem"
import { useWalletClient } from "wagmi"

import { Button } from "@/components/ui/button"

export function PrepareDAO({ dao, hash }: { dao: Address; hash: bigint }) {
  const { data: walletClient } = useWalletClient()

  async function prepareDAO() {
    if (!walletClient) {
      return
    }
    const grantPermissionData = {
      where: dao,
      permissionId: keccak256(toBytes("EXECUTE_PERMISSION")),
    }
    const multisigPlugin = "0x25ec2b7236bdaad095afe9b39024a8003aff5545"
    const fullAddress = "0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF"

    const proposalMetadata = "0x"
    const actions = [
      {
        to: dao,
        value: BigInt(0),
        data: encodeFunctionData({
          abi: DAOContract.abi,
          functionName: "grant",
          args: [
            grantPermissionData.where,
            AddressTrustlessManagement,
            grantPermissionData.permissionId,
          ],
        }),
      },
      {
        to: AddressTrustlessManagement,
        value: BigInt(0),
        data: encodeFunctionData({
          abi: [
            parseAbiItem(
              "function changeFullAccess(address _dao, uint256 _role, address _permissionChecker)"
            ),
          ],
          functionName: "changeFullAccess", // Ideally restrict to partialPayment, increaseBudget, increaseReward, and extendDeadline
          args: [dao, OptimsticActionsRole, fullAddress],
        }),
      },
      {
        to: dao,
        value: BigInt(0),
        data: encodeFunctionData({
          abi: DAOContract.abi,
          functionName: "grant",
          args: [
            grantPermissionData.where,
            VerifiedContributorTagTrustlessManagementContract.address,
            grantPermissionData.permissionId,
          ],
        }),
      },
      {
        to: VerifiedContributorTagTrustlessManagementContract.address,
        value: BigInt(0),
        data: encodeFunctionData({
          abi: VerifiedContributorTagTrustlessManagementContract.abi,
          functionName: "changeZoneAccess",
          args: [dao, hash, OptimisticActionsContract.address, fullAddress],
        }),
      },
    ] as const
    const allowFailureMap = BigInt(0)
    const startDate = BigInt(0)
    const endDate = BigInt(
      Math.round(new Date().getTime() / 1000) + 7 * 24 * 60 * 60
    ) // Now + 7 days
    const approveProposal = true
    const tryEarlyExecution = true

    await walletClient.writeContract({
      abi: [
        parseAbiItem(
          "function createProposal(bytes calldata _metadata,(address to, uint256 value, bytes data)[] calldata _actions,uint256 _allowFailureMap,bool _approveProposal,bool _tryExecution,uint64 _startDate,uint64 _endDate)"
        ),
      ],
      address: multisigPlugin,
      functionName: "createProposal",
      args: [
        proposalMetadata,
        actions,
        allowFailureMap,
        approveProposal,
        tryEarlyExecution,
        startDate,
        endDate,
      ],
    })
  }

  return (
    <Button onClick={() => prepareDAO().catch(console.error)}>Run setup</Button>
  )
}
