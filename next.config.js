/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  output: 'standalone',
  images: {
    loader: "default",
    domains: ["cdn.weatherapi.com"],
  },
};

module.exports = nextConfig;
