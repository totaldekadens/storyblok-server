/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    storyblokApiToken: process.env.STORYBLOK_API_TOKEN,
    storyblockOathToken: process.env.STORYBLOK_OATH_TOKEN,
  },
  /* async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://resonant-mooncake-8b4eef.netlify.app/:path*",
      }
    ];
  }, */
};

module.exports = nextConfig;
