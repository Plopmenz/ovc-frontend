"use client"

import { useEffect, useState } from "react"
import { DepartmentsReturn } from "@/ovc-indexer/api/return-types"
import { reviver } from "@/ovc-indexer/openrd-indexer/utils/json"
import axios from "axios"

import { ShowDepartmentSummary } from "./show-department-summary"

export function Departments() {
  const [departments, setDepartments] = useState<DepartmentsReturn>([])

  useEffect(() => {
    const getDepartments = async () => {
      const response = await axios.get("/indexer/departments")
      if (response.status !== 200) {
        throw new Error(`Fetching departments error: ${response.data}`)
      }
      setDepartments(JSON.parse(JSON.stringify(response.data), reviver))
    }

    getDepartments().catch(console.error)
  }, [])

  return (
    <div>
      {departments.map((department, i) => (
        <ShowDepartmentSummary key={i} hash={department.hash} />
      ))}
    </div>
  )
}
