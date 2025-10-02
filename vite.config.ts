import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  const isSSRBuild = process.env.npm_lifecycle_event?.includes('build:server');
  
  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(), 
      mode === "development" && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    ssr: {
      noExternal: ['react-helmet-async', 'react-router-dom'],
    },
    build: {
      outDir: isSSRBuild ? 'dist/server' : 'dist/client',
      ssr: isSSRBuild,
      ssrManifest: !isSSRBuild,
      rollupOptions: {
        input: isSSRBuild ? './src/entry-server.tsx' : undefined,
        output: isSSRBuild ? {
          format: 'esm',
        } : {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'ui-vendor': ['@radix-ui/react-accordion', '@radix-ui/react-dialog'],
          },
        },
      },
    },
  };
});
