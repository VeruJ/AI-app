import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Default is 1MB; the vision board can upload several photos at once.
      bodySizeLimit: "25mb",
    },
  },
};

export default nextConfig;
