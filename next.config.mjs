/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: () => [
    {
      source: "/indexer/:call*",
      destination: "https://ovc.plopmenz.com/indexer/:call*",
    },
    {
      source: "/openrd-indexer/:call*",
      destination: "https://openrd.plopmenz.com/indexer/:call*",
    },
  ],
  reactStrictMode: true,
}

export default nextConfig
