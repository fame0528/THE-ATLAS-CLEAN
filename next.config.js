/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['better-sqlite3'],
  },
  env: {
    NEXT_PUBLIC_ATLAS_TOKEN: process.env.ATLAS_TOKEN,
  },
};

module.exports = nextConfig;