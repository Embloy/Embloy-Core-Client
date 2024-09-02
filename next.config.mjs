import { withContentlayer } from "next-contentlayer"

import "./env.mjs"

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["avatars.githubusercontent.com", "f005.backblazeb2.com", "embloy2.blob.core.windows.net", "embloy.s3.eu-central-1.amazonaws.com"],
  },
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ["@prisma/client"],
  },
  output: "standalone",
}

export default withContentlayer(nextConfig)
