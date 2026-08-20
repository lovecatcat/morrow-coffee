import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Local networks can block Next.js from proxying Shopify CDN images.
    // Vercel production keeps image optimization enabled.
    unoptimized: process.env.NODE_ENV === "development",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/s/files/**",
      },
    ],
  },
};

export default nextConfig;
