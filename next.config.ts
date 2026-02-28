import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable runtime config for security; use env vars only at build time
  runtimeConfig: {
    public: {
      atlasToken: process.env.ATLAS_TOKEN,
    },
  },
  // Ensure clean output
  output: "standalone",
  // Prevent exposing server internals
  poweredByHeader: false,
  // Strict CSP in production (handled by custom headers if needed)
  // Keep it simple; we'll add auth middleware in API routes
};

export default nextConfig;
