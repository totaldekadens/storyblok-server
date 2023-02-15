/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    storyblokApiToken: process.env.STORYBLOK_API_TOKEN,
    storyblockOathToken: process.env.STORYBLOK_OATH_TOKEN,
  },
};

module.exports = nextConfig;
