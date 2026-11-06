/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          destination: `http://localhost:${process.env.API_PORT || '5000'}/api/:path*`
        },
        {
          source: '/sitemap.xml',
          destination: `http://localhost:${process.env.API_PORT || '5000'}/sitemap.xml`
        }
      ];
    }

    return [];
  }
};

export default nextConfig;
