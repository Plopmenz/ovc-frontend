"use client"

import { useEffect, useState } from "react"
import { OptimisticPaymentsReturn } from "@/ovc-indexer/api/return-types"
import { ObjectFilter } from "@/ovc-indexer/openrd-indexer/api/filter"
import { FilterTasksReturn } from "@/ovc-indexer/openrd-indexer/api/return-types"
import { replacer, reviver } from "@/ovc-indexer/openrd-indexer/utils/json"
import axios from "axios"
import { Address, checksumAddress, keccak256, toBytes } from "viem"

import { useDAOMetadata } from "@/hooks/useDAOMetadata"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { ShowPayment } from "./show-payment"
import { ShowTaskSummary } from "./show-task"
import { defaultChain } from "./web3-provider"

export function ShowDepartment({ dao }: { dao: Address }) {
  const metadata = useDAOMetadata(dao)
  const hash = BigInt(keccak256(toBytes("SMARTCONTRACTS")))

  const [tasks, setTasks] = useState<FilterTasksReturn>([])
  useEffect(() => {
    const getTasks = async () => {
      const filter: ObjectFilter = {
        manager: { equal: checksumAddress(dao) },
        chainId: { equal: defaultChain.id },
      }
      const response = await axios.post(
        "/openrd-indexer/filterTasks/",
        JSON.parse(JSON.stringify(filter, replacer))
      )
      if (response.status !== 200) {
        throw new Error(`Fetching department tasks error: ${response.data}`)
      }
      const filteredTasks = JSON.parse(JSON.stringify(response.data), reviver)
      setTasks(filteredTasks)
    }

    getTasks().catch(console.error)
  }, [dao])

  const getOptimisticPayments = async () => {
    const response = await axios.get(`/indexer/optimisticPayments/${dao}`)
    if (response.status !== 200) {
      throw new Error(`Fetching optimistic payments error: ${response.data}`)
    }
    const payments = JSON.parse(JSON.stringify(response.data), reviver)
    setOptmisticPayments(payments)
  }
  const [optimisticPayments, setOptmisticPayments] =
    useState<OptimisticPaymentsReturn>({})
  useEffect(() => {
    getOptimisticPayments().catch(console.error)
  }, [dao])

  const refresh = async () => {
    await getOptimisticPayments().catch(console.error)
  }

  return (
    <div className="flex max-w-[980px] flex-col items-start gap-2">
      <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
        {metadata.title ?? dao}
      </h1>
      {metadata.description && (
        <p className="max-w-[700px] text-lg text-muted-foreground">
          {metadata.description}
        </p>
      )}
      <Tabs defaultValue="tasks">
        <TabsList>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>
        <TabsContent value="tasks">
          {tasks.map((task, i) => {
            return (
              <ShowTaskSummary
                key={i}
                chainId={task.chainId}
                taskId={task.taskId}
                hash={hash}
                refresh={refresh}
              />
            )
          })}
        </TabsContent>
        <TabsContent value="payments">
          <div>
            {Object.keys(optimisticPayments).map((requestIdString, i) => {
              const requestId = parseInt(requestIdString)
              return (
                <ShowPayment
                  key={i}
                  requestId={requestId}
                  hash={hash}
                  payment={optimisticPayments[requestId]}
                  dao={dao}
                  refresh={refresh}
                />
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
