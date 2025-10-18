// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // 👈 enables static export (replaces `next export`)
  devIndicators: false, // Disable all dev indicators
};

export default nextConfig;
