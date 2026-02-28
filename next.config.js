/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // for local deployment
  // Disable x-powered-by header for security
  poweredByHeader: false,
  // No external images for now (local only)
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
