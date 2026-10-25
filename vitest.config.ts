import path from 'path';
import { defineConfig } from 'vitest/config';

// ----------------------------------------------------------------------

// Unit tests for pure logic. Kept apart from vite.config.ts so the type and
// lint checker plugins do not run during tests.
export default defineConfig({
  resolve: {
    alias: [{ find: /^src(.+)/, replacement: path.resolve(process.cwd(), 'src/$1') }],
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
