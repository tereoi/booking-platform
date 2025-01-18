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
        // Handle business subdomains
        {
          source: '/:path*',
          has: [
            {
              type: 'host',
              value: '(?<businessId>.*)\\.appointweb\\.nl',
            },
          ],
          destination: '/book/:businessId/:path*',
        },
      ],
    }
  },
}

module.exports = nextConfig