import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    BACK_URL: process.env.BACK_URL,
  }
};

export default nextConfig;
