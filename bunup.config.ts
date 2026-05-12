import { defineConfig } from 'bunup';

export default defineConfig({
  entry: 'src/index.ts',
  format: ['esm', 'cjs'],
  outDir: 'dist',
  dts: true,
  minify: true,
  clean: true,
  splitting: true,
  packages: 'external',
  sourcemap: 'linked',
});
