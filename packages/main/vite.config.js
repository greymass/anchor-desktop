/* eslint-env node */

import {chrome} from '../../.electron-vendors.cache.json'
import {join} from 'path'
import {builtinModules} from 'module'
import {svelte} from '@sveltejs/vite-plugin-svelte'

const PACKAGE_ROOT = __dirname

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
const config = {
    mode: process.env.MODE,
    root: PACKAGE_ROOT,
    resolve: {
        alias: {
            '~/': `${join(PACKAGE_ROOT, 'src')}/`,
            '$/': `${join(PACKAGE_ROOT, '../stores')}/`,
        },
    },
    plugins: [svelte()],
    base: '',
    server: {
        fs: {
            strict: true,
        },
    },
    build: {
        sourcemap: true,
        target: `chrome${chrome}`,
        outDir: 'dist',
        assetsDir: '.',
        rollupOptions: {
            input: join(PACKAGE_ROOT, 'index.html'),
            external: [...builtinModules.flatMap((p) => [p, `node:${p}`])],
        },
        emptyOutDir: true,
        brotliSize: false,
    },
    test: {
        environment: 'jsdom',
    },
}

export default config
