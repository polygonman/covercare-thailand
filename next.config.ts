import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Reverse proxy for PostHog — routes tracking requests through our own domain
  // so ad blockers can't block them. /ingest → us.i.posthog.com
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
  // Required so Next.js doesn't redirect /ingest/decide/ → /ingest/decide
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
