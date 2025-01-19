// next.config.ts
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['firebasestorage.googleapis.com', 'res.cloudinary.com'],
  },
  async rewrites() {
    return {
      beforeFiles: [
        // Handle business subdomains in production
        {
          source: '/:path*',
          has: [
            {
              type: 'host',
              value: '(?<businessId>.*)\\.appointweb\\.nl',
            },
          ],
          destination: '/business/:businessId/:path*',
        },
        // Handle local development with query parameter
        {
          source: '/:path*',
          has: [
            {
              type: 'query',
              key: 'business',
            },
          ],
          destination: '/business/:business/:path*',
        },
      ],
    }
  },
}

module.exports = nextConfig