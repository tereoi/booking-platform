// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['firebasestorage.googleapis.com', 'res.cloudinary.com'],
  },
  async rewrites() {
    if (process.env.NODE_ENV === 'development') {
      // Development rewrites voor lokaal testen
      return [
        {
          source: '/:path*',
          has: [
            {
              type: 'query',
              key: 'business'
            }
          ],
          destination: '/:path*'
        }
      ];
    } else {
      // Productie rewrites voor subdomains
      return [
        {
          source: '/:path*',
          has: [
            {
              type: 'host',
              value: '(?<businessId>.*)\\.appointweb\\.nl'
            }
          ],
          destination: '/:path*'
        }
      ];
    }
  },
  // Custom hostname config voor development
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          }
        ]
      }
    ];
  }
}

module.exports = nextConfig;