import { AbiError } from "abitype"
import { Abi } from "viem"

export function errorsOfAbi(abi: Abi): AbiError[] {
  return abi.filter((abiItem) => abiItem.type === "error") as AbiError[]
}
