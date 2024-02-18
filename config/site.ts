export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Verified Contributor" as const,
  description: "Your NFT as contributor to the Openmesh ecosystem." as const,
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Leaderboard",
      href: "/leaderboard",
    },
    {
      title: "Apply",
      href: "/apply",
    },
  ],
  links: {
    openrd: "https://openrd.plopmenz.com/",
  },
}
