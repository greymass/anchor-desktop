// setup shared svelte stores
import '@stores'
import {app, ipcMain} from 'electron'

import '~/modules/security'
import events from '@types/events'

import {handleRequest} from '~/modules/esr'
import {disableProtocolHandlers, enableProtocolHandlers} from '~/modules/protocols'
import {enableSigner} from '~/modules/signer'
import {enableSocket} from '~/modules/socket'
import {log as logger} from '~/modules/log'
import {createMainWindow} from '~/windows/main'

const log = logger.scope('core')

const lock = process.mas || app.requestSingleInstanceLock()
let modulesInitialized = false

if (!lock) {
    log.debug('Prevented second instance of Anchor.')
    app.quit()
    process.exit(0)
} else {
    log.info('Starting Anchor...')

    app.on('ready', async () => {
        /**
         * Launch the main window when app is ready
         */
        createMainWindow()
    })

    app.on('will-quit', () => {
        log.info('will-quit')
        /**
         * Remove URI scheme protocol handlers in development
         */
        if (process.env.NODE_ENV === 'development') {
            logger.debug('Disabling protocol handlers registered from development build.')
            disableProtocolHandlers()
        }
    })

    /**
     * Handle incoming open-url requests for URI scheme protocols
     */
    app.on('open-url', (e, url) => {
        log.debug(`open-url: ${url}`)
        handleRequest(url)
    })

    /**
     * Mock transaction for testing purposes, triggable via renderer
     */
    ipcMain.on(events.SIGNING_REQUEST_EXAMPLE, () => {
        handleRequest(
            'esr://gmNgZGBY1mTC_MoglIGBIVzX5uxZRqAQGDBBaV2YAAQ0pMD4LK7-wSCaxzEvOSO_yEghODM9DygJAA'
        )
    })

    ipcMain.on(events.ANCHOR_READY, () => {
        if (!modulesInitialized) {
            log.debug('Initializing modules...')
            /**
             * Register URI scheme protocol handlers (esr, etc)
             */
            enableProtocolHandlers()

            /**
             * Enable IBC for background signer
             */
            enableSigner()

            /**
             * Enable buoy socket for background communication
             */
            enableSocket()

            // Lock to prevent this from firing more than once
            modulesInitialized = true
            log.debug('Modules initialized!')
        }
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
