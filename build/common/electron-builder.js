/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const common = {
    appId: 'com.greymass.anchordesktop.release',
    productName: 'Anchor Wallet',
    artifactName: '${os}-${name}-${version}-${arch}.${ext}',
    asar: true,
    directories: {
        output: 'release',
        buildResources: 'buildResources',
    },
    files: ['packages/**/dist/**'],
    protocols: [
        {
            name: 'esr',
            role: 'Viewer',
            schemes: ['anchor', 'esr', 'anchorcreate'],
        },
    ],
    publish: {
        provider: 'github',
    },
}

module.exports = common
