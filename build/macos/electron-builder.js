/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const config = {
    appId: 'com.greymass.anchordesktop.release',
    productName: 'Anchor Wallet',
    afterSign: 'build/macos/notarize.js',
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
    mac: {
        category: 'public.app-category.finance',
        darkModeSupport: true,
        icon: 'build/assets/icons/mac/icon.icns',
        entitlements: 'build/macos/entitlements.mac.plist',
        entitlementsInherit: 'build/macos/entitlements.mac.inherit.plist',
        identity: 'Greymass Inc. (CE35MAVD43)',
        provisioningProfile: 'embedded.provisionprofile',
        hardenedRuntime: true,
        gatekeeperAssess: false,
        target: ['dmg', 'zip'],
    },
    dmg: {
        icon: 'build/assets/icons/mac/icon.icns',
        sign: true,
        contents: [
            {
                x: 130,
                y: 220,
            },
            {
                x: 410,
                y: 220,
                type: 'link',
                path: '/Applications',
            },
        ],
    },
}

module.exports = config
