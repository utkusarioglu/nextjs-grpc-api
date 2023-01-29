module.exports = {
  reactStrictMode: true,
  distDir: "dist",
  publicRuntimeConfig: {
    domainName: process.env.NEXT_PUBLIC_DOMAIN_NAME,
    scheme: process.env.SCHEME,
  },
};
