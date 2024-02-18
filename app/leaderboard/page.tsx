import { Leaderboard } from "@/components/custom/leaderboard"

export default function LeaderboardPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Leaderboard
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          See all real time ranking of the verified contirbutors.
        </p>
      </div>
      <Leaderboard />
    </section>
  )
}
