const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [
      require('remark-gfm'),
      require('remark-prism')
    ],
    rehypePlugins: [
      require('rehype-slug'),
      require('rehype-autolink-headings'),
      require('rehype-code-titles')
    ],
    providerImportSource: '@mdx-js/react'
  }
});

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Router configuration (appDir is now stable in Next.js 14)
  
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },
  
  // Image optimization
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30 // 30 days
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://vitals.vercel-insights.com https://vercel.live;"
          }
        ]
      }
    ];
  },
  
  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/docs',
        destination: '/docs/getting-started',
        permanent: true
      }
    ];
  },
  
  // Webpack configuration
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Monaco Editor configuration
    config.module.rules.push({
      test: /\.worker\.(js|ts)$/,
      use: {
        loader: 'worker-loader',
        options: {
          name: 'static/[hash].worker.js',
          publicPath: '/_next/'
        }
      }
    });
    
    // Ignore Monaco Editor in SSR
    if (isServer) {
      config.externals.push('monaco-editor');
    }
    
    return config;
  },
  
  // Output configuration
  // output: 'standalone', // Disabled due to Windows symlink permissions
  
  // Trailing slash configuration
  trailingSlash: false,

  // Redirects
  async redirects() {
    return [
      {
        source: '/docs/getting-started',
        destination: '/docs',
        permanent: true,
      },
    ];
  },
  
  // Page extensions
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  
  // Environment variables
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version || '0.0.1',
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
    NEXT_PUBLIC_VERCEL_URL: process.env.VERCEL_URL
  },
  
  // Experimental features
  experimental: {
    optimizePackageImports: [
      '@headlessui/react',
      '@heroicons/react',
      'framer-motion',
      'recharts'
    ]
  }
};

module.exports = withBundleAnalyzer(withMDX(nextConfig));
