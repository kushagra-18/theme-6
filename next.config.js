/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow external images from BlazeBlog CDN
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.blazeblog.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'blazeblog.s3.apac.amazonaws.com',
        pathname: '/**',
      }
    ],
  },
};

module.exports = nextConfig;

