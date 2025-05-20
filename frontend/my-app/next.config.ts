/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
    domains: [
      // Add any image domains you need here
    ],
  },
  // This is important for Netlify deployment
  output: 'export',
  // Disable server components when deploying to Netlify as static site
  experimental: {
    serverComponents: false,
  },
};

module.exports = nextConfig;