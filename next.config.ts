import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  compiler: {
    styledComponents: true,
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
