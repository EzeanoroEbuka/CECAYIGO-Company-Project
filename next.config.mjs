/** @type {import('next').NextConfig} */
const nextConfig = {
  // Strict mode causes double-rendering in dev (makes it feel slow).
  // Keep disabled in dev for normal speed; enable for production CI checks.
  reactStrictMode: process.env.NODE_ENV === "production",

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "pixabay.com" },
      { protocol: "https", hostname: "ui-avatars.com" },
      { protocol: "https", hostname: "*.googleusercontent.com" },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  swcMinify: true,
  compress: true,
  poweredByHeader: false,

  compiler: {
    // Strip console.log in production only
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
