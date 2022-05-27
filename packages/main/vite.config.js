/* eslint-env node */

import {join} from 'path'
import {builtinModules} from 'module'
import {svelte} from '@sveltejs/vite-plugin-svelte'
import {chrome} from '../../.electron-vendors.cache.json'
import {getAliases} from '../shared/vite/aliases'

const PACKAGE_ROOT = __dirname

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
const config = {
    mode: process.env.MODE,
    root: PACKAGE_ROOT,
    resolve: {
        alias: getAliases(PACKAGE_ROOT),
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
