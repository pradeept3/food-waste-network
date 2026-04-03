// Location: frontend/vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  // Plugins
  plugins: [
    react({
      // Enable Fast Refresh
      fastRefresh: true,
      // Babel configuration for React
      babel: {
        plugins: [],
      },
    }),
  ],

  // Development server configuration
  server: {
    port: 3000,
    host: true, // Listen on all addresses (0.0.0.0)
    strictPort: false, // Try next port if 3000 is busy
    open: true, // Auto open browser
    cors: true, // Enable CORS
    
    // Proxy API requests to backend
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // WebSocket proxy (if needed)
      '/ws': {
        target: 'ws://localhost:8000',
        ws: true,
        changeOrigin: true,
      },
    },

    // HMR (Hot Module Replacement) configuration
    hmr: {
      overlay: true, // Show error overlay
      port: 3000,
    },

    // Watch options
    watch: {
      usePolling: true, // Enable if running in Docker
      interval: 1000,
    },
  },

  // Preview server (for production build preview)
  preview: {
    port: 4173,
    host: true,
    strictPort: false,
    open: true,
  },

  // Build configuration
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // Set to true for debugging production
    minify: 'terser', // or 'esbuild' for faster builds
    
    // Terser options for better minification
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
      },
    },

    // Chunk size warnings
    chunkSizeWarningLimit: 1000, // KB

    // Rollup options
    rollupOptions: {
      output: {
        // Manual chunks for better caching
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'chart-vendor': ['recharts'],
        },
        
        // Asset file names
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.').pop();
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/woff|woff2|eot|ttf|otf/i.test(extType)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        
        // Chunk file names
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },

    // CSS code splitting
    cssCodeSplit: true,
    
    // Generate manifest for asset tracking
    manifest: true,
    
    // Report compressed size
    reportCompressedSize: true,
    
    // Emit assets
    emitAssets: true,
  },

  // Path resolution
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@config': path.resolve(__dirname, './src/config'),
      '@api': path.resolve(__dirname, './src/api'),
    },
    extensions: ['.js', '.jsx', '.json', '.css'],
  },

  // CSS configuration
  css: {
    devSourcemap: true, // Enable CSS source maps in dev
    preprocessorOptions: {
      // If using SCSS
      scss: {
        additionalData: `@import "@/styles/variables.scss";`,
      },
    },
    modules: {
      // CSS Modules configuration
      localsConvention: 'camelCase',
    },
  },

  // Define global constants
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },

  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'recharts',
    ],
    exclude: [],
  },

  // Environment variables prefix
  envPrefix: 'VITE_',

  // Base public path
  base: '/',

  // Public directory
  publicDir: 'public',

  // Log level
  logLevel: 'info', // 'info' | 'warn' | 'error' | 'silent'

  // Clear screen on server restart
  clearScreen: true,

  // REMOVED esbuild jsxInject to prevent duplicate React imports
})