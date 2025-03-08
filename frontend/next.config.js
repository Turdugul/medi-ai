/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  poweredByHeader: false,
  distDir: '.next',
  generateEtags: false,
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  // Configure static file serving
  basePath: '',
  assetPrefix: '',
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/_next/static/:path*',
          destination: '/static/:path*'
        }
      ]
    }
  },
  // Server configuration
  serverRuntimeConfig: {
    hostname: process.env.HOSTNAME || '0.0.0.0',
    port: parseInt(process.env.PORT || '5000', 10)
  },
  // Environment variables that will be shared across server and client
  publicRuntimeConfig: {
    frontendUrl: process.env.FRONTEND_URL,
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
    port: parseInt(process.env.PORT || '5000', 10)
  },
  // CORS headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-Requested-With, Content-Type, Authorization' },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
        ]
      }
    ];
  }
};

module.exports = nextConfig; 