/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // allow linting warnings during build instead of failing
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
