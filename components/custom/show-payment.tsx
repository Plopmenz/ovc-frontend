"use client"

import Link from "next/link"
import { OptimisticPaymentsDecimals } from "@/contracts/OptimisticActionsManagement"
import { OptimisticPayment } from "@/ovc-indexer/types/optimistic-payment"
import { Address, formatUnits } from "viem"

import { siteConfig } from "@/config/site"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import { ExecuteOptimisticPayment } from "./execute-optimistic-payment"
import { RejectOptimisticPayment } from "./reject-optimistic-payment"
import { SanitizeHTML } from "./sanitize-html"
import { defaultChain } from "./web3-provider"

interface ShowPaymentMetadata {
  title?: string
  description?: string
}

interface ShowRejectionMetadata {
  reason?: string
}

export function ShowPayment({
  requestId,
  hash,
  payment,
  dao,
  refresh,
}: {
  requestId: number
  hash: bigint
  payment: OptimisticPayment
  dao: Address
  refresh: () => Promise<void>
}) {
  const indexedMetadata = payment?.cachedMetadata
    ? (JSON.parse(payment?.cachedMetadata) as ShowPaymentMetadata)
    : undefined
  const rejectionMetadata = payment?.cachedRejectionMetadata
    ? (JSON.parse(payment?.cachedRejectionMetadata) as ShowRejectionMetadata)
    : undefined

  return (
    <Card>
      <CardHeader>
        <CardTitle>{indexedMetadata?.title ?? `#${requestId}`}</CardTitle>
        {payment.rejected && <Badge variant="destructive">Rejected</Badge>}
        {payment.executed && <Badge variant="success">Executed</Badge>}
      </CardHeader>
      <CardContent>
        {indexedMetadata?.description && (
          <SanitizeHTML html={indexedMetadata.description} />
        )}
        {payment.actions.map((action, i) => {
          switch (action.type) {
            case "partialPayment":
              if (
                action.partialNativePayment.length !== 0 ||
                action.partialPayment.length !== 1
              ) {
                return (
                  <div key={i}>Illegal partial payment, please reject!</div>
                )
              }
              return (
                <div key={i}>
                  Partial payment of{" "}
                  <Link
                    href={`${siteConfig.links.openrd}/tasks/${defaultChain.id}:${action.taskId}`}
                    target="_blank"
                  >
                    task {action.taskId.toString()}
                  </Link>{" "}
                  for $
                  {formatUnits(
                    action.partialPayment[0],
                    OptimisticPaymentsDecimals
                  )}
                  .
                </div>
              )
            case "budgetIncrease":
              if (
                action.nativeBudgetIncrease !== BigInt(0) ||
                action.budgetIncrease.length !== 1
              ) {
                return (
                  <div key={i}>Illegal budget increase, please reject!</div>
                )
              }
              return (
                <div key={i}>
                  <span>
                    Increase budget of{" "}
                    <Link
                      href={`${siteConfig.links.openrd}/tasks/${defaultChain.id}:${action.taskId}`}
                      target="_blank"
                    >
                      task {action.taskId.toString()}
                    </Link>{" "}
                    with $
                    {formatUnits(
                      action.budgetIncrease[0],
                      OptimisticPaymentsDecimals
                    )}
                    .
                  </span>
                </div>
              )
            case "deadlineExtension":
              return (
                <div key={i}>
                  Deadline extension of{" "}
                  <Link
                    href={`${siteConfig.links.openrd}/tasks/${defaultChain.id}:${action.taskId}`}
                    target="_blank"
                  >
                    task {action.taskId.toString()}
                  </Link>{" "}
                  of{" "}
                  {(action.deadlineExtension / BigInt(24 * 60 * 60)).toString()}{" "}
                  days
                </div>
              )
          }
        })}
      </CardContent>
      <CardFooter>
        {payment.rejected && (
          <div>
            <span>Rejected:</span>
            {rejectionMetadata?.reason ? (
              <SanitizeHTML html={rejectionMetadata.reason} />
            ) : (
              <span>No reason was provided.</span>
            )}
          </div>
        )}
        {!payment.rejected && !payment.executed && (
          <div className="grid grid-cols-1 gap-y-3">
            {payment.executableFrom <
            Math.round(new Date().getTime() / 1000) ? (
              <ExecuteOptimisticPayment
                dao={dao}
                requestId={requestId}
                refresh={refresh}
              />
            ) : (
              <span>
                Becomes executable on{" "}
                {new Date(Number(payment.executableFrom) * 1000).toDateString()}
              </span>
            )}
            <Separator />
            <RejectOptimisticPayment
              dao={dao}
              hash={hash}
              requestId={requestId}
              refresh={refresh}
            />
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
