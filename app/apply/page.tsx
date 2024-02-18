import { Leaderboard } from "@/components/custom/leaderboard"

export default function ApplyPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Apply
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Give us some information on why you deserve to be a verified
          contributor.
        </p>
      </div>
      <div className="flex gap-4">
        Put some webform here like Bruno did before?
      </div>
    </section>
  )
}
