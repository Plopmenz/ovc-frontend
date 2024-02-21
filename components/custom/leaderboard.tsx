"use client"

import { useEffect, useState } from "react"
import { LeaderboardReturn } from "@/ovc-indexer/api/return-types"
import { reviver } from "@/ovc-indexer/openrd-indexer/utils/json"
import axios from "axios"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardReturn>([])

  useEffect(() => {
    const getLeaderboard = async () => {
      const response = await axios.get("/indexer/leaderboard")
      if (response.status !== 200) {
        throw new Error(`Fetching leaderboard error: ${response.data}`)
      }
      setLeaderboard(JSON.parse(JSON.stringify(response.data), reviver))
    }

    getLeaderboard().catch(console.error)
  }, [])

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Position</TableHead>
          <TableHead>Verified Contributor</TableHead>
          <TableHead>Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leaderboard.map((item, position) => (
          <TableRow key={position}>
            <TableCell className="font-medium">#{position + 1}</TableCell>
            <TableCell>{item.tokenId.toString()}</TableCell>
            <TableCell>{item.score}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
