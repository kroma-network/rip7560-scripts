/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    // set experiments
    config.experiments = { ...config.experiments, asyncWebAssembly: true };
    config.resolve.fallback = { fs: false, path: false, net: false, tls: false };
    return config;
  },
};

module.exports = nextConfig;
