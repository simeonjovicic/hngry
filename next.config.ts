import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // only local brand assets — skip the image optimizer so the Cloudflare
  // Workers deploy has no dependency on Cloudflare Images
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
