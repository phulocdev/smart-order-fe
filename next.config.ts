import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost'
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/degyrxhon/image/upload/**'
      }
    ]
  }
}

export default nextConfig
