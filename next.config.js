/* eslint-disable import/no-extraneous-dependencies */
// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// });

module.exports = {
  eslint: {
    dirs: ['.'],
  },
  poweredByHeader: false,
  trailingSlash: false,
  basePath: '',
  // The starter code load resources from `public` folder with `router.basePath` in React components.
  // So, the source code is "basePath-ready".
  // You can remove `basePath` if you don't need it.
  reactStrictMode: false,
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: "https",
  //       hostname: "investorweb-dev.s3.eu-north-1.amazonaws.com",
  //       port: "",
  //       pathname: "/**",
  //     },
  //   ],
  // },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'drfasttrackno-dev.s3.eu-central-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'drfasttrack-dev.s3.eu-north-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'dev-drfastrack.s3.eu-central-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  env: {
    BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },
};
