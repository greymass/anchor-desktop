import {app} from 'electron'
import '~/modules/security'
import {createMainWindow} from '~/windows/main'
import {createSignerWindow} from '~/windows/signer'

const lock = process.mas || app.requestSingleInstanceLock()

if (!lock) {
    app.quit()
    process.exit(0)
} else {

    app.on('second-instance', (e, argv) => {
    })

    app.on('open-url', (e, url) => {
    })

    app.on('ready', async () => {
        enableHandler()
        createMainWindow()
        createSignerWindow()
    })
}

/**
 * Disable Hardware Acceleration for more power-save
 */
app.disableHardwareAcceleration()

/**
 * @see https://www.electronjs.org/docs/v14-x-y/api/app#event-activate-macos Event: 'activate'
 */
app.on('activate', createMainWindow)

/**
 * Check new app version in production mode only
 */
if (import.meta.env.PROD) {
    app.whenReady()
        .then(() => import('electron-updater'))
        .then(({autoUpdater}) => autoUpdater.checkForUpdatesAndNotify())
        .catch((e) => console.error('Failed check updates:', e))
}
