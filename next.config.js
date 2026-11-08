/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    webpackMemoryOptimizations: true
  },
  serverExternalPackages: ['mongoose', 'mongodb', 'bcryptjs'],
  async headers() {
    return [
      {
        source: '/assets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ];
  },
  async rewrites() {
    if (process.env.NODE_ENV !== 'development') return [];

    return [
      {
        source: '/api/:path*',
        destination: `http://localhost:${process.env.API_PORT || '5000'}/api/:path*`
      }
    ];
  }
};

export default nextConfig;
