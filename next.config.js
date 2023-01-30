module.exports = {
  reactStrictMode: true,
  distDir: "dist",
  experimental: {
    appDir: true,
  },
  publicRuntimeConfig: {
    domainName: process.env.NEXT_PUBLIC_DOMAIN_NAME,
    scheme: process.env.SCHEME,
  },
};
