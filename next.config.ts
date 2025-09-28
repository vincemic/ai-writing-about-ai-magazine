import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: process.env.NODE_ENV === 'production' ? '/ai-ui-test-modern' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/ai-ui-test-modern/' : '',
};

export default nextConfig;
