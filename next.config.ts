import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      enabled: true
    },
  },
  server: {
    port: 3000,
  },
};

export default nextConfig;
