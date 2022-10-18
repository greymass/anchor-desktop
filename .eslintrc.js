module.exports = {
    env: {
        es6: true,
        node: true,
        browser: true,
    },
    parser: '@typescript-eslint/parser',
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
    ],
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2019,
    },
    plugins: ['svelte3', '@typescript-eslint'],
    globals: {
        fetch: false,
    },
    settings: {
        jsdoc: {
            tagNamePreference: {
                returns: 'return',
            },
        },
        'svelte3/typescript': require('typescript'),
    },
    overrides: [
        {
            files: ['**/*.svelte'],
            processor: 'svelte3/svelte3',
        },
    ],
    ignorePatterns: [
        'src/packages/preload/exposedInMainWorld.d.ts',
        'node_modules/**',
        '**/dist/**',
    ],
    rules: {
        'no-multi-spaces': [
            'error',
            {
                ignoreEOLComments: true,
                exceptions: {
                    VariableDeclarator: true,
                },
            },
        ],
        'block-spacing': ['error', 'always'],
        'array-bracket-spacing': ['error', 'never'],
        'space-in-parens': ['error', 'never'],
        'comma-spacing': [
            'error',
            {
                before: false,
                after: true,
            },
        ],
        'key-spacing': [
            'error',
            {
                afterColon: true,
                beforeColon: false,
            },
        ],
        quotes: [
            'error',
            'single',
            {
                avoidEscape: true,
                allowTemplateLiterals: true,
            },
        ],
        semi: ['error', 'never'],
        'no-constant-condition': ['warn'],
        curly: ['error', 'all'],
        'brace-style': [
            'error',
            '1tbs',
            {
                allowSingleLine: false,
            },
        ],
        'keyword-spacing': [
            'error',
            {
                before: true,
                after: true,
            },
        ],
        'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
        'spaced-comment': [2, 'always', {markers: ['/']}],
        'space-before-blocks': ['error', 'always'],
        'space-before-function-paren': 'off',
        'prefer-template': 'error',
        'no-useless-concat': 'error',
        'linebreak-style': ['error', 'unix'],
        'eol-last': ['error', 'always'],
        'template-curly-spacing': ['error', 'never'],
        'no-multiple-empty-lines': 'off',
    },
}
