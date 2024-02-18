"use client"

import { useEffect, useState } from "react"
import { LeaderboardReturn } from "@/ovc-indexer/api/return-types"
import { reviver } from "@/ovc-indexer/openrd-indexer/utils/json"
import axios from "axios"

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
    <table>
      <thead>
        <tr>
          <th>Position</th>
          <th>Token Id</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        {leaderboard.map((item, position) => (
          <tr>
            <td>#{position + 1}</td>
            <td>{item.tokenId.toString()}</td>
            <td>{item.score}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
