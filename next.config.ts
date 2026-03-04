import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Don't block production builds on lint errors
  },
  typescript: {
    ignoreBuildErrors: true, // Allow Vercel deploy with type warnings
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
  },
};

export default nextConfig;
