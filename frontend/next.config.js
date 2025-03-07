/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  poweredByHeader: false,
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
    ];
  },
  // Server configuration
  serverRuntimeConfig: {
    // Will only be available on the server side
    hostname: process.env.HOSTNAME || '0.0.0.0',
  },
  // Environment variables that will be shared across server and client
  publicRuntimeConfig: {
    frontendUrl: process.env.FRONTEND_URL,
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
  }
};

module.exports = nextConfig; 