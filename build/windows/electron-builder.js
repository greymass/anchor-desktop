/* eslint @typescript-eslint/no-var-requires: "off" */
const common = require('../common/electron-builder')

/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const config = {
    win: {
        icon: 'build/assets/icons/win/icon.ico',
        publisherName: 'Greymass Inc.',
        target: [
            {
                target: 'nsis',
                arch: ['x64', 'ia32'],
            },
        ],
    },
    nsis: {
        allowToChangeInstallationDirectory: true,
        createDesktopShortcut: 'always',
        createStartMenuShortcut: true,
        deleteAppDataOnUninstall: true,
        oneClick: false,
        perMachine: true,
        shortcutName: 'Anchor Wallet',
    },
}

module.exports = {
    ...common,
    ...config,
}
