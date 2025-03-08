import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    remotePatterns:[
      {
        protocol:"https",
        hostname:'utfs.io'
      }
    ]
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        '7c7lln1t-3000.uks1.devtunnels.ms',
        'localhost:3000'
      ],
      // allowedForwardedHosts: [
      //   '7c7lln1t-3000.uks1.devtunnels.ms',
      //   'localhost:3000'
      // ],
    },
  },
};

export default nextConfig;
