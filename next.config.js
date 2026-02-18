/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'stickersdevs.com.br',
      },
      {
        protocol: 'https',
        hostname: 'images.icon-icons.com',
      },
      {
        protocol: 'https',
        hostname: 'marcbruederlin.gallerycdn.vsassets.io',
      },
      {
        protocol: 'https',
        hostname: 'logowik.com',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'asset.brandfetch.io',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'cdn.iconscout.com',
      },
      {
        protocol: 'https',
        hostname: 'yt3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'udemy-certificate.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'i.postimg.cc',
      },
    ],
  },
}

module.exports = nextConfig

