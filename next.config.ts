import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
      dynamicIO: true
  },
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
            },
            {
                protocol: "https",
                hostname: "api.byte2bye.net",
            },
        ],
    },
};

export default nextConfig;
