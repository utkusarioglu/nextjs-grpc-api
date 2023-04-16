module.exports = {
  reactStrictMode: true,
  distDir: "dist",
  experimental: {
    typedRoutes: true,
    instrumentationHook: true,
    appDir: true,
  },
  // publicRuntimeConfig: {
  //   domainName: process.env.NEXT_PUBLIC_DOMAIN_NAME,
  //   scheme: process.env.SCHEME,
  // },
};
