/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: { serverActions: true },
    typescript: { 
      ignoreBuildErrors: true,
    },
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'res.cloudinary.com',
          pathname: '/**',
        },
      ],
    },
  }

module.exports = nextConfig
