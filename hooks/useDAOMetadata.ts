import { useEffect, useState } from "react"
import { reviver } from "@/ovc-indexer/openrd-indexer/utils/json"
import axios from "axios"
import { Address } from "viem"

export interface DAOMetadata {
  title?: string
  description?: string
}

export function useDAOMetadata(address?: Address) {
  const [metadata, setMetadata] = useState<DAOMetadata>({})

  useEffect(() => {
    const getMetadata = async () => {
      if (!address) {
        setMetadata({})
        return
      }

      const response = await axios.get(`/openrd-indexer/user/${address}`)
      if (response.status !== 200) {
        throw new Error(`Fetching departments error: ${response.data}`)
      }
      const user = JSON.parse(JSON.stringify(response.data), reviver)
      setMetadata(user.metadata ? JSON.parse(user.metadata) : {})
    }

    getMetadata().catch(console.error)
  }, [address])

  return metadata
}
