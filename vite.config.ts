import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  base: '/mou-isshu/',
  plugins: [preact()],
  server: {
    port: 5181,
  },
});
