import {join} from 'path'

/*
 * Return common aliases to Anchor related folders
 */
export function getAliases(PACKAGE_ROOT) {
    const PROJECT_ROOT = `${join(PACKAGE_ROOT, '../../')}`
    return {
        '~/': `${join(PACKAGE_ROOT, 'src')}/`,
        '@assets/': `${join(PROJECT_ROOT, 'assets/')}`,
        '@components/': `${join(PROJECT_ROOT, 'components/')}`,
        '@packages/': `${join(PROJECT_ROOT, 'packages/')}`,
        '@stores/': `${join(PROJECT_ROOT, 'stores/')}`,
        '@types/': `${join(PROJECT_ROOT, 'types/')}`,
    }
}
