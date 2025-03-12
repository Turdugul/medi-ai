const nextConfig = {
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
  }
};

export default nextConfig;
