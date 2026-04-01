/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  // Enable React compiler optimizations
  reactStrictMode: false,
  // Faster dev builds with SWC minification
  swcMinify: true,
  // Reduce bundle size
  // Note: disabled modularizeImports for lucide-react as the icon files don't match the expected pattern
  // The optimizePackageImports option below handles tree-shaking instead
  // Experimental performance features
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-tabs",
      "@radix-ui/react-select",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-collapsible",
      "@radix-ui/react-tooltip",
      "@radix-ui/react-popover",
      "@radix-ui/react-slider",
      "recharts",
      "date-fns",
    ],
  },
}

export default nextConfig
