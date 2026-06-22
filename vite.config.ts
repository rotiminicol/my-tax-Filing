// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    // Configure Nitro for Vercel deployment
    nitro: {
      preset: "vercel",
    },
  },
  vite: {
    // react-router-dom is used in App.tsx which is loaded client-side via dynamic import.
    // TanStack Start's SSR pass must be able to resolve it, so we inline it instead of
    // treating it as an SSR external.
    ssr: {
      noExternal: ["react-router-dom", "react-router"],
    },
    optimizeDeps: {
      include: ["react-router-dom", "react-router"],
    },
  },
});
