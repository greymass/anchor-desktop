/* eslint @typescript-eslint/no-var-requires: "off" */
const common = require('../common/electron-builder')

/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const config = {
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

module.exports = {
    ...common,
    ...config,
}
