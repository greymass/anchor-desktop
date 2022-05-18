import {node} from '../../.electron-vendors.cache.json'
import {join} from 'path'
import {builtinModules} from 'module'

const PACKAGE_ROOT = __dirname
const PROJECT_ROOT = `${join(PACKAGE_ROOT, '../../')}`

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
             */
            '~/': `${join(PACKAGE_ROOT, 'src')}/`,
            '@assets/': `${join(PROJECT_ROOT, 'assets/')}`,
            '@components/': `${join(PROJECT_ROOT, 'components/')}`,
            '@packages/': `${join(PROJECT_ROOT, 'packages/')}`,
            '@stores/': `${join(PROJECT_ROOT, 'packages/stores/')}`,
            '@types/': `${join(PROJECT_ROOT, 'types/')}`,
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
