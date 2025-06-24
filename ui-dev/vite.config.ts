import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Log important paths for debugging
console.log('Project root:', __dirname);
console.log('UI Source:', path.resolve(__dirname, '../plugin/Source/UI'));
console.log('Store path:', path.resolve(__dirname, 'src/store.ts'));

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: 'react',
      babel: {
        plugins: [
          ['@babel/plugin-transform-react-jsx', {
            runtime: 'automatic',
            importSource: 'react'
          }]
        ]
      }
    })
  ],
  resolve: {
    alias: {
      // Local paths
      '@': path.resolve(__dirname, '../plugin/Source/UI'),
      '@store': path.resolve(__dirname, 'src/store'),
      // Core dependencies
      'react': path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
      'framer-motion': path.resolve(__dirname, 'node_modules/framer-motion'),
      'zustand': path.resolve(__dirname, 'node_modules/zustand'),
      'scheduler': path.resolve(__dirname, 'node_modules/scheduler'),
      'use-sync-external-store': path.resolve(__dirname, 'node_modules/use-sync-external-store'),
      'react-window': path.resolve(__dirname, 'node_modules/react-window'),
      'react/jsx-runtime': path.resolve(__dirname, 'node_modules/react/jsx-runtime'),
      '@tanstack/react-virtual': path.resolve(__dirname, 'node_modules/@tanstack/react-virtual')
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      'framer-motion',
      'zustand',
      'scheduler',
      'use-sync-external-store',
      '@tanstack/react-virtual',
      'use-sync-external-store/shim/with-selector'
    ],
    esbuildOptions: {
      // This helps with some dependency resolution issues
      preserveSymlinks: true,
      // Ensure JSX is handled properly
      loader: {
        '.js': 'jsx',
        '.ts': 'tsx',
        '.tsx': 'tsx',
      },
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    open: true,
    fs: {
      // Allow serving files from one level up from the package root
      allow: ['..']
    }
  },
  define: {
    'process.env': {}
  }
});