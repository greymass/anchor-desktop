const common = require('../common/electron-builder.js')

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
                'application/x-esr;x-scheme-handler/esr;application/x-anchor;x-scheme-handler/anchor;',
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
}

module.exports = {
    ...common,
    ...config,
}
