import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: process.env.NODE_ENV === 'production' ? '/ai-writing-about-ai-magazine' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/ai-writing-about-ai-magazine/' : '',
};

export default nextConfig;
