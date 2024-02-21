"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { DepartmentReturn } from "@/ovc-indexer/api/return-types"
import { reviver } from "@/ovc-indexer/openrd-indexer/utils/json"
import axios from "axios"
import { Hex } from "viem"

export function ShowDepartmentSummary({ hash }: { hash: Hex }) {
  const [department, setDepartment] = useState<DepartmentReturn | undefined>(
    undefined
  )

  useEffect(() => {
    const getDepartment = async () => {
      const response = await axios.get(`/indexer/department/${hash}`)
      if (response.status !== 200) {
        throw new Error(`Fetching department error: ${response.data}`)
      }
      setDepartment(JSON.parse(JSON.stringify(response.data), reviver))
    }

    getDepartment().catch(console.error)
  }, [hash])

  if (!department) {
    return <span>{hash}</span>
  }

  return <Link href={`departments/${department.dao}`}>{department.name}</Link>
}
