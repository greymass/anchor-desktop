/* eslint @typescript-eslint/no-var-requires: "off" */
const common = require('../common/electron-builder')

/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const config = {
    linux: {
        category: 'Network',
        description:
            'Anchor is a security and privacy focused open-source digital wallet for all EOSIO-based networks.',
        desktop: {
            Name: 'anchor-wallet',
            GenericName: 'Anchor Wallet',
            'X-GNOME-FullName': 'anchor-wallet',
            Comment:
                'Anchor is a security and privacy focused open-source digital wallet for all EOSIO-based networks.',
            Type: 'Application',
            Terminal: 'false',
            StartupNotify: 'false',
            Categories: 'Network;',
            MimeType:
                'application/x-esr;x-scheme-handler/esr;application/x-anchor;x-scheme-handler/anchor;application/x-anchorcreate;x-scheme-handler/anchorcreate;',
        },
        icon: 'build/assets/icons/png',
        target: [
            {
                target: 'deb',
                arch: ['armv7l', 'arm64', 'x64'],
            },
            'AppImage',
        ],
    },
    appImage: {
        desktop: {
            MimeType:
                'application/x-esr;x-scheme-handler/esr;application/x-anchor;x-scheme-handler/anchor;application/x-anchorcreate;x-scheme-handler/anchorcreate;',
        },
    },
}

module.exports = {
    ...common,
    ...config,
}
