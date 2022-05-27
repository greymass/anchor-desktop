import {join} from 'path'
import {builtinModules} from 'module'
import {node} from '../../.electron-vendors.cache.json'
import {getAliases} from '../shared/vite/aliases'

const PACKAGE_ROOT = __dirname

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
const config = {
    mode: process.env.MODE,
    root: PACKAGE_ROOT,
    envDir: process.cwd(),
    resolve: {
        alias: {
            /*
             * Common aliases to Anchor related folders
             * See: packages/shared/vite/aliases.ts
             */
            ...getAliases(PACKAGE_ROOT),
            /*
             * The ws package for whatever reason believes it exists in a browser.
             * This forces it to load the nodejs version here in electron.
             */
            ws: `${join(PACKAGE_ROOT, '../../node_modules/ws/index.js')}`,
        },
    },
    build: {
        sourcemap: 'inline',
        target: `node${node}`,
        outDir: 'dist',
        assetsDir: '.',
        minify: process.env.MODE !== 'development',
        lib: {
            entry: 'src/index.ts',
            formats: ['cjs'],
        },
        rollupOptions: {
            external: [
                'electron',
                'electron-devtools-installer',
                ...builtinModules.flatMap((p) => [p, `node:${p}`]),
            ],
            output: {
                entryFileNames: '[name].cjs',
            },
        },
        emptyOutDir: true,
        brotliSize: false,
    },
}

export default config
