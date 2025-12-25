/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true
  },
  trailingSlash: true,
  reactStrictMode: true,
  output: 'export',
  // output: 'standalone'
}

module.exports = nextConfig;

