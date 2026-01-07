import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  experimental: { esmExternals: "loose" },
};

export default nextConfig;
