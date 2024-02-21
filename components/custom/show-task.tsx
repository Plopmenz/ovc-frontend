"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { VerifiedContributorTagTrustlessManagementContract } from "@/contracts/VerifiedContributorTagTrustlessManagement"
import {
  IndexedTask,
  TaskState,
} from "@/ovc-indexer/openrd-indexer/types/tasks"
import { reviver } from "@/ovc-indexer/openrd-indexer/utils/json"
import axios from "axios"
import { useAccount, usePublicClient } from "wagmi"

import { siteConfig } from "@/config/site"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { CreateOptimisticPayment } from "./create-optimistic-payment"

interface ShowTaskSummaryMetadata {
  title?: string
}

export function ShowTaskSummary({
  chainId,
  taskId,
  role,
  refresh,
}: {
  chainId: number
  taskId: bigint
  role: bigint
  refresh: () => Promise<void>
}) {
  const account = useAccount()
  const publicClient = usePublicClient()

  const [indexedTask, setIndexedTask] = useState<IndexedTask | undefined>(
    undefined
  )
  useEffect(() => {
    const getIndexedTask = async () => {
      const response = await axios.get(
        `/openrd-indexer/task/${chainId.toString()}/${taskId.toString()}`
      )
      if (response.status !== 200) {
        throw new Error(`Fetching task error: ${response.data}`)
      }
      const taskInfo = JSON.parse(JSON.stringify(response.data), reviver)
      setIndexedTask(taskInfo)
    }

    getIndexedTask().catch(console.error)
  }, [chainId, taskId])

  const [hasRole, setHasRole] = useState<boolean>(false)
  useEffect(() => {
    const getHasRole = async () => {
      if (!publicClient || !account.address) {
        setHasRole(false)
        return
      }

      const accountHasRole = await publicClient.readContract({
        abi: VerifiedContributorTagTrustlessManagementContract.abi,
        address: VerifiedContributorTagTrustlessManagementContract.address,
        functionName: "hasRole",
        args: [account.address, role],
      })
      setHasRole(accountHasRole)
    }

    getHasRole().catch(console.error)
  }, [publicClient, account.address, role])

  const indexedMetadata = indexedTask?.cachedMetadata
    ? (JSON.parse(indexedTask?.cachedMetadata) as ShowTaskSummaryMetadata)
    : undefined

  const [firstRender, setFirstRender] = useState(true)
  useEffect(() => {
    setFirstRender(false)
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {indexedMetadata?.title ?? `#${taskId.toString()}`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Link
          href={`${siteConfig.links.openrd}/tasks/${chainId}:${taskId}`}
          target="_blank"
        >
          View task
        </Link>
      </CardContent>
      {!firstRender &&
        hasRole &&
        account.address &&
        indexedTask?.state === TaskState.Taken &&
        indexedTask.applications[indexedTask.executorApplication]?.applicant ===
          account.address && (
          <CardFooter>
            <CreateOptimisticPayment
              dao={indexedTask.manager}
              role={role}
              taskId={taskId}
              task={indexedTask}
              refresh={refresh}
            />
          </CardFooter>
        )}
    </Card>
  )
}
