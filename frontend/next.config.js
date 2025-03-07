/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
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
  output: 'standalone',
  poweredByHeader: false,
  experimental: {
    outputFileTracingRoot: undefined,
  },
  serverRuntimeConfig: {
    PORT: process.env.PORT || 3001
  },
  env: {
    PORT: process.env.PORT || 3001
  }
};

module.exports = nextConfig; 