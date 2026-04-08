
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react-swc';
  import tailwindcss from '@tailwindcss/vite';
  import path from 'path';

  export default defineConfig({
    plugins: [tailwindcss(), react()],
    // Prevent esbuild from pre-bundling rapier — it has an inline base64 WASM
    // blob that esbuild strips. Excluding lets the browser load it natively.
    optimizeDeps: {
      exclude: ['@react-three/rapier', '@dimforge/rapier3d-compat'],
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      target: 'esnext',
      outDir: 'dist',
      chunkSizeWarningLimit: 3000,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-three': ['three', '@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],
'vendor-motion': ['framer-motion', 'motion'],
            'vendor-globe': ['globe.gl'],
          },
        },
      },
    },
    server: {
      port: 3000,
      open: true,
    },
  });