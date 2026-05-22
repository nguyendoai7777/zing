import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite';

function resolvePathsAlias() {
  const tsConfigRaw = readFileSync('./tsconfig.app.json', 'utf-8');

  // remove comments
  const cleanedTsConfig = tsConfigRaw.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');

  const tsconfig = JSON.parse(cleanedTsConfig);

  const paths = tsconfig.compilerOptions?.paths || {};

  const aliases: Record<string, string> = {};

  for (const [key, value] of Object.entries(paths)) {
    const aliasKey = key.replace(/\/\*$/, '');

    const aliasPath = (value as string[])[0].replace(/\/\*$/, '');

    aliases[aliasKey] = resolve(process.cwd(), aliasPath);
  }

  return aliases;
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss({ optimize: {} }), react(), babel({ presets: [reactCompilerPreset()] })],
  resolve: {
    alias: resolvePathsAlias(),
  },
});
