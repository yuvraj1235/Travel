import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Allow this origin in development for HMR and dev overlays
  // Add other hosts as needed.
  allowedDevOrigins: ["172.30.3.185"],
};

export default nextConfig;
