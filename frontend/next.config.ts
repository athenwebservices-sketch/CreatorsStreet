// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // Enables static export (replaces `next export`)
  devIndicators: {
    buildActivity: false, // Disables build activity indicator
    appIsrStatus: false, // Disables the ISR (Incremental Static Regeneration) status indicator
  },
};

export default nextConfig;
