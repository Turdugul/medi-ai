/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true
  },
  trailingSlash: true,
  reactStrictMode: true,
  experimental: {
    forceSwcTransforms: true // Force the use of SWC transforms
  },
  webpack(config, { isServer }) {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
        os: false,
      };
    }
    return config;
  },
  // Use 'standalone' for production builds on Render
  // Remove 'output: export' as it doesn't support API routes
  // Only set output in production, let Next.js handle dev mode
  ...(process.env.NODE_ENV === 'production' && { output: 'standalone' }),
}

module.exports = nextConfig;

