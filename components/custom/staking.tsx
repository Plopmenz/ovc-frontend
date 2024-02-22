"use client"

import { useEffect, useState } from "react"
import { VerifiedContributorStakingContract } from "@/contracts/VerifiedContributorStaking"
import { VerifiedContributorContract } from "@/ovc-indexer/contracts/VerifiedContributor"
import { formatUnits } from "viem"
import {
  useAccount,
  usePublicClient,
  useSimulateContract,
  useWriteContract,
} from "wagmi"

import { Button } from "@/components/ui/button"

import { Input } from "../ui/input"

export function Staking() {
  const account = useAccount()
  const publicClient = usePublicClient()
  const { writeContractAsync } = useWriteContract()
  const [submitting, setSubmitting] = useState<boolean>(false)

  const [tokenId, setTokenId] = useState<bigint>(BigInt(0))
  useEffect(() => {
    const getTokenId = async () => {
      if (!publicClient || !account.address) {
        setTokenId(BigInt(0))
        return
      }

      const tokens = await publicClient.readContract({
        abi: VerifiedContributorContract.abi,
        address: VerifiedContributorContract.address,
        functionName: "balanceOf",
        args: [account.address],
      })
      if (tokens === BigInt(0)) {
        setTokenId(BigInt(0))
        return
      }

      const token = await publicClient.readContract({
        abi: VerifiedContributorContract.abi,
        address: VerifiedContributorContract.address,
        functionName: "tokenOfOwnerByIndex",
        args: [account.address, BigInt(0)],
      })
      setTokenId(token)
    }

    getTokenId().catch(console.error)
  }, [publicClient, account.address])

  const [tokensClaimable, setTokensClaimable] = useState<bigint>(BigInt(0))
  useEffect(() => {
    const getTokensClaimable = async () => {
      if (!publicClient || !tokenId) {
        setTokensClaimable(BigInt(0))
        return
      }

      const claimable = await publicClient.readContract({
        abi: VerifiedContributorStakingContract.abi,
        address: VerifiedContributorStakingContract.address,
        functionName: "claimable",
        args: [tokenId],
      })
      setTokensClaimable(claimable)
    }

    getTokensClaimable().catch(console.error)
  }, [publicClient, tokenId])

  const { data: stakeRequest, isError: stakeError } = useSimulateContract({
    account: account.address,
    abi: VerifiedContributorStakingContract.abi,
    address: VerifiedContributorStakingContract.address,
    functionName: "stake",
    args: [tokenId],
  })

  const { data: unstakeRequest, isError: unstakeError } = useSimulateContract({
    account: account.address,
    abi: VerifiedContributorStakingContract.abi,
    address: VerifiedContributorStakingContract.address,
    functionName: "unstake",
    args: [tokenId],
  })

  const { data: claimRequest, isError: claimError } = useSimulateContract({
    account: account.address,
    abi: VerifiedContributorStakingContract.abi,
    address: VerifiedContributorStakingContract.address,
    functionName: "claim",
    args: [tokenId],
  })

  return (
    <div className="grid grid-cols-1 gap-y-3">
      <div className="flex w-full">
        <Input readOnly={true} value={formatUnits(tokensClaimable, 18)} />
        <Button
          disabled={claimError || submitting}
          onClick={async () => {
            if (!claimRequest) {
              return
            }
            setSubmitting(true)
            await writeContractAsync(claimRequest.request).catch(console.error)
            setSubmitting(false)
          }}
        >
          Claim
        </Button>
      </div>
      <Button
        disabled={stakeError || submitting}
        onClick={async () => {
          if (!stakeRequest) {
            return
          }
          setSubmitting(true)
          await writeContractAsync(stakeRequest.request).catch(console.error)
          setSubmitting(false)
        }}
      >
        Stake
      </Button>
      <Button
        disabled={unstakeError || submitting}
        onClick={async () => {
          if (!unstakeRequest) {
            return
          }
          setSubmitting(true)
          await writeContractAsync(unstakeRequest.request).catch(console.error)
          setSubmitting(false)
        }}
      >
        Unstake
      </Button>
    </div>
  )
}
