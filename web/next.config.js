const path = require('path');
const withTM = require('next-transpile-modules')([
  path.join(__dirname, '../lovable-src/ui-kit'),
  path.join(__dirname, '../shared'),
]);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
    emotion: true,
  },

  productionBrowserSourceMaps: true,

  // Disable React's StrictMode for now to avoid double-rendering in development
  reactStrictMode: false,

  // Enable static exports for the test environment
  output: process.env.NODE_ENV === 'test' ? 'export' : undefined,

  // Disable SSR for testing to avoid React hook errors
  ...(process.env.NODE_ENV === 'test' && {
    experimental: {
      esmExternals: 'loose',
      externalDir: true,
      ssr: false,
    },
  }),

  // Configure page extensions to include both .tsx and .page.tsx for backward compatibility
  pageExtensions: ['tsx', 'ts', 'jsx', 'js', 'page.tsx', 'page.ts', 'page.jsx', 'page.js'],

  // Webpack configuration
  webpack: (config, { isServer, dev }) => {
    // Configure aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@shared': path.resolve(__dirname, '../shared'),
      '@ui-kit': path.resolve(__dirname, '../lovable-src/ui-kit/src'),
      '@lib': path.resolve(__dirname, 'lib'),
      '@': path.resolve(__dirname, 'src'),
    };

    // Handle Node.js modules that shouldn't be bundled
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        stream: false,
        crypto: false,
      };
    }

    // Add support for .mjs files used by some dependencies
    config.module.rules.push({
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false,
      },
    });

    // Add a rule to handle client-side components
    config.module.rules.push({
      test: /\.(tsx|ts|jsx|js)$/,
      include: [
        path.resolve(__dirname, '../lovable-src/ui-kit'),
        path.resolve(__dirname, '../shared'),
      ],
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
            plugins: [
              ['@babel/plugin-transform-runtime', { regenerator: true }],
              ['@babel/plugin-proposal-class-properties', { loose: true }],
              ['@babel/plugin-transform-modules-commonjs'],
            ],
          },
        },
      ],
    });

    return config;
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_APP_ENV: process.env.NODE_ENV || 'development',
  },

  // Configure images
  images: {
    domains: [],
    unoptimized: process.env.NODE_ENV === 'test', // Disable image optimization in test
  },

  // Disable TypeScript type checking during build for faster builds
  typescript: {
    ignoreBuildErrors: true,
  },

  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Enable experimental features
  experimental: {
    esmExternals: 'loose',
    externalDir: true,
  },

  // Configure headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

// Apply next-transpile-modules with custom configuration
module.exports = withTM({
  ...nextConfig,
  // Ensure client-side components are properly transpiled
  transpilePackages: [
    '@radix-ui/react-*',
    '@radix-ui/colors',
    'framer-motion',
    'class-variance-authority',
    'clsx',
    'tailwind-merge',
    'date-fns',
    'lucide-react',
    'sonner',
    'vaul',
    'embla-carousel-react',
    'embla-carousel-autoplay',
    'embla-carousel-auto-scroll',
    'embla-carousel',
    'recharts',
    'react-day-picker',
    'react-hook-form',
    'zod',
    '@hookform/resolvers',
    '@radix-ui/react-icons',
    '@radix-ui/react-slot',
    '@radix-ui/react-dialog',
    '@radix-ui/react-dropdown-menu',
    '@radix-ui/react-avatar',
    '@radix-ui/react-label',
    '@radix-ui/react-popover',
    '@radix-ui/react-scroll-area',
    '@radix-ui/react-separator',
    '@radix-ui/react-slot',
    '@radix-ui/react-tabs',
    '@radix-ui/react-toast',
    '@radix-ui/react-tooltip',
    '@radix-ui/react-accordion',
    '@radix-ui/react-alert-dialog',
    '@radix-ui/react-aspect-ratio',
    '@radix-ui/react-checkbox',
    '@radix-ui/react-collapsible',
    '@radix-ui/react-context-menu',
    '@radix-ui/react-hover-card',
    '@radix-ui/react-menubar',
    '@radix-ui/react-navigation-menu',
    '@radix-ui/react-progress',
    '@radix-ui/react-radio-group',
    '@radix-ui/react-select',
    '@radix-ui/react-slider',
    '@radix-ui/react-switch',
    '@radix-ui/react-toggle',
    '@radix-ui/react-toggle-group',
    '@radix-ui/react-visually-hidden',
    'class-variance-authority',
    'clsx',
    'tailwind-merge',
    'date-fns',
    'lucide-react',
    'sonner',
    'vaul',
    'embla-carousel-react',
    'embla-carousel-autoplay',
    'embla-carousel-auto-scroll',
    'embla-carousel',
    'recharts',
    'react-day-picker',
    'react-hook-form',
    'zod',
    '@hookform/resolvers',
    'next-themes',
    'framer-motion',
    'react-intersection-observer',
    'react-remove-scroll',
    'react-remove-scroll-bar',
    'react-use-measure',
    'use-callback-ref',
    '@dnd-kit/utilities',
    '@dnd-kit/core',
    '@dnd-kit/sortable',
    '@dnd-kit/modifiers',
    '@dnd-kit/accessibility',
    '@dnd-kit/core',
    '@dnd-kit/modifiers',
    '@dnd-kit/sortable',
    '@dnd-kit/utilities',
    '@floating-ui/react',
    '@floating-ui/react-dom',
    '@floating-ui/core',
    '@floating-ui/dom',
    '@floating-ui/react-dom',
    '@floating-ui/utils',
    '@floating-ui/react',
    '@floating-ui/react-dom-interactions',
    '@floating-ui/react-dom',
    '@floating-ui/utils',
    '@floating-ui/react',
    '@floating-ui/react-dom',
    '@floating-ui/utils',
    '@floating-ui/react',
    '@floating-ui/react-dom',
    '@floating-ui/utils',
    '@floating-ui/react',
    '@floating-ui/react-dom',
    '@floating-ui/utils',
    '@floating-ui/react',
    '@floating-ui/react-dom',
    '@floating-ui/utils',
  ],
});
