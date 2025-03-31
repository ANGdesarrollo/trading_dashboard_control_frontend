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
        ],
    },
};

export default nextConfig;
