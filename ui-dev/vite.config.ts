import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  server: {
    port: 5173,
    strictPort: true,
    host: true,
    open: true,
    fs: {
      allow: ['..']
    }
  },
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
  base: './',
  build: {
    outDir: '../build/RHYTHM_artefacts/Release/AU/RHYTHM.component/Contents/Resources',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@store': path.resolve(__dirname, 'src/store'),
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
      preserveSymlinks: true,
      loader: {
        '.js': 'jsx',
        '.ts': 'tsx',
        '.tsx': 'tsx'
      }
    }
  },

  define: {
    'process.env': {}
  }
});