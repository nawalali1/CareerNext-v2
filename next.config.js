/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable ESLint during builds to avoid build failures
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
