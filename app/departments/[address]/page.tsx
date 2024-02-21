import { isAddress } from "viem"

import { ShowDepartment } from "@/components/custom/show-department"

export default function DepartmentPage({
  params,
}: {
  params: { address?: string }
}) {
  const dao = params.address
  if (!dao || !isAddress(dao)) {
    return <span>Incorrect address.</span>
  }

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <ShowDepartment dao={dao} />
    </section>
  )
}
