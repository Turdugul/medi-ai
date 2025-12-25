/** @type {import('next').NextConfig} */
const nextConfig = {
  // Core configuration
  reactStrictMode: false,
  swcMinify: true,

  // Environment configuration
  env: {
    API_URL: process.env.API_URL || 'http://localhost:5000',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'https://dentists-assistant-ai.onrender.com',
  },

  // Development configuration
  experimental: {
    // Enable modern development features
    scrollRestoration: true,
  },

  // Image configuration
  images: {
    domains: ['localhost', 'dentists-assistant-ai.onrender.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Webpack configuration
  webpack: (config, { dev, isServer }) => {
    // Optimize for development
    if (dev) {
      config.optimization.moduleIds = 'named';
      config.optimization.chunkIds = 'named';
    }

    // Client-side polyfills
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
      };
    }

    return config;
  },
};

module.exports = nextConfig;

