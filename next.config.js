/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    loader: "default",
    domains: ["cdn.weatherapi.com"],
  },
};

module.exports = nextConfig;
