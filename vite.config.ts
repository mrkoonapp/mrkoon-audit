import fs from 'fs';
import path from 'path';
import checker from 'vite-plugin-checker';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react-swc';

// ----------------------------------------------------------------------

const PORT = 3030;

// Selects which environment's universal-links association files (Apple AASA +
// Android assetlinks.json) get served at the canonical `/.well-known/` paths.
// The per-env sources live in `public/.well-known/universal-links/<env>/`; the
// two generated root files are gitignored.
// Choose the env with `VITE_APP_ENV` (dev | staging | prod), defaulting to prod.
function wellKnownPlugin(): Plugin {
  const ALLOWED_ENVS = ['dev', 'staging', 'prod'];
  const FILES = ['apple-app-site-association', 'assetlinks.json'];

  return {
    name: 'well-known-universal-links',
    configResolved(config) {
      const requested = process.env.VITE_APP_ENV ?? 'prod';
      const env = ALLOWED_ENVS.includes(requested) ? requested : 'prod';

      if (!ALLOWED_ENVS.includes(requested)) {
        config.logger.warn(
          `[well-known] Unknown VITE_APP_ENV="${requested}", falling back to "prod"`
        );
      }

      const srcDir = path.resolve(config.root, 'public/.well-known/universal-links', env);
      const destDir = path.resolve(config.root, 'public/.well-known');

      for (const file of FILES) {
        const from = path.join(srcDir, file);
        if (!fs.existsSync(from)) continue;
        fs.copyFileSync(from, path.join(destDir, file));
      }

      config.logger.info(`[well-known] Serving "${env}" universal-links association files`);
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      checker({
        typescript: true,
        eslint: {
          useFlatConfig: true,
          lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
          dev: { logLevel: ['error'] },
        },
        overlay: false,
      }),
      wellKnownPlugin(),
    ],
    resolve: {
      alias: [
        {
          find: /^src(.+)/,
          replacement: path.resolve(process.cwd(), 'src/$1'),
        },
      ],
      // Force a single instance of these packages. Without this, Vite's dep
      // pre-bundler can create two copies of @mui/x-date-pickers' internal
      // LocalizationProvider context (the provider is imported from one subpath,
      // the pickers from another), which throws:
      //   "MUI X: Can not find the date and time pickers localization context".
      dedupe: [
        '@mui/x-date-pickers',
        '@mui/material',
        '@mui/system',
        '@emotion/react',
        '@emotion/styled',
      ],
    },
    // Pre-bundle the pickers (and the adapter) as one optimized dependency so the
    // provider and every picker subpath resolve to the same context instance.
    optimizeDeps: {
      include: ['@mui/x-date-pickers', '@mui/x-date-pickers/AdapterDayjs'],
    },
    server: {
      port: PORT,
      host: true,
    },
    preview: { port: PORT, host: true },
  };
});
