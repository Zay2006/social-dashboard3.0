/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
  images: {
    domains: ['iddtbmgmstqtjuyrjrzz.supabase.co'],
  },
};

module.exports = nextConfig;
