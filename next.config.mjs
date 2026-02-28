/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  output: 'standalone',
  env: {
    ATLAS_TOKEN: process.env.ATLAS_TOKEN,
    OPENCLAW_GATEWAY: process.env.OPENCLAW_GATEWAY || 'http://localhost:3001',
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
