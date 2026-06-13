const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  disable: true,
  register: false,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
};

module.exports = withPWA(nextConfig);
