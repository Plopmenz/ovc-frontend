export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Verified Contributor",
  description: "Your NFT as contributor to the Openmesh ecosystem.",
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
      title: "Departments",
      href: "/departments",
    },
    {
      title: "Apply",
      href: "/apply",
    },
  ],
  links: {
    openrd: "https://openrd.plopmenz.com/",
  },
} as const
