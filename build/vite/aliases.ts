import {join} from 'path'

/*
 * Return common aliases to Anchor related folders
 */
export function getAliases(PACKAGE_ROOT) {
    const PROJECT_ROOT = `${join(PACKAGE_ROOT, '../../../')}`
    return {
        '~/': `${join(PACKAGE_ROOT, 'src')}/`,
        '@assets/': `${join(PROJECT_ROOT, 'src/shared/assets/')}`,
        '@components/': `${join(PROJECT_ROOT, 'src/shared/components/')}`,
        '@packages/': `${join(PROJECT_ROOT, 'src/packages/')}`,
        '@shared/': `${join(PROJECT_ROOT, 'src/shared/')}`,
        '@stores/': `${join(PROJECT_ROOT, 'src/shared/stores/')}`,
        '@types/': `${join(PROJECT_ROOT, 'src/shared/types/')}`,
    }
}
