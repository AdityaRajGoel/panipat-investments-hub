import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

import { VitePWA } from "vite-plugin-pwa";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),

    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp,xml}'],
        maximumFileSizeToCacheInBytes: 5000000, // 5MB limit
        navigateFallbackDenylist: [/^\/.*\.xml$/, /^\/.*\.txt$/, /^\/yandex_.*\.html$/]
      },
      manifest: {
        name: 'Parasram India - Panipat',
        short_name: 'Parasram',
        description: 'Best Stock Broker in Panipat | Legacy Stock Brokers Since 1970',
        theme_color: '#0A192F',
        background_color: '#0A192F',
        display: 'standalone',
        icons: [
          {
            src: '/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    }),

    // Bundle breakdown: npm run analyze -> dist/stats.html
    mode === "analyze" &&
      visualizer({
        filename: "dist/stats.html",
        gzipSize: true,
        brotliSize: true,
      })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Match motion before the generic 'react' check - its dist paths
            // contain 'react' and would otherwise split across two chunks.
            if (id.includes('node_modules/motion') || id.includes('node_modules/framer-motion')) {
              return 'animation-vendor';
            }
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'react-vendor';
            }
            if (id.includes('@radix-ui') || id.includes('lucide-react')) {
              return 'ui-vendor';
            }
            // Tiny utils shared by the app AND recharts (clsx etc.) — pin them
            // to react-vendor or rollup buries them inside chart-vendor, which
            // forces the 104KB chart chunk to load eagerly on every page.
            if (id.includes('/clsx') || id.includes('tailwind-merge') || id.includes('class-variance-authority')) {
              return 'react-vendor';
            }
            if (id.includes('recharts') || id.includes('d3')) {
              return 'chart-vendor';
            }
            if (id.includes('@tanstack/react-query')) {
              return 'query-vendor';
            }
            if (id.includes('@supabase/supabase-js')) {
              return 'supabase-vendor';
            }
          }
        }
      }
    }
  }
}));
