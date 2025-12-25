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
  // No output mode needed - Next.js will build normally for Render
  // This works better with Render's deployment process
}

module.exports = nextConfig;

