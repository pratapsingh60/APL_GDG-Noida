/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // REMOVE output: 'export' - it breaks API routes
  // output: 'export',  // DELETE THIS LINE
  trailingSlash: true,
  turbopack: {
    root: process.cwd(),
  },
}

module.exports = nextConfig