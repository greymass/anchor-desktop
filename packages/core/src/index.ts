// setup shared svelte stores
import '@stores'
import {app} from 'electron'

import '~/modules/security'
import {handleRequest} from '~/modules/esr'
import {enableHandler} from '~/modules/handler'
import {log as logger} from '~/modules/log'
import {createMainWindow} from '~/windows/main'
import {disableHandler} from './modules/handler'
// import {APIClient, FetchProvider, Name, Serializer} from '@greymass/eosio'
// import fetch from 'node-fetch'
// import {sharedInfo} from '../../stores'

const log = logger.scope('core')

const lock = process.mas || app.requestSingleInstanceLock()

if (!lock) {
    log.debug('Prevented second instance of Anchor.')
    app.quit()
    process.exit(0)
} else {
    log.debug('Starting...')
    log.debug('debug uri: esr://gmNgZACDVwahBaKXOu-tMrrLCBViYILSgjCBBUZ3JaRfXk1lAAoAAA')

    app.on('open-url', (e, url) => {
        log.debug(`open-url: ${url}`)
        handleRequest(url)
    })

    app.on('ready', async () => {
        /**
         * Register URI scheme protocol handlers (esr, etc)
         */
        enableHandler()

        /**
         * Launch the main window
         */
        createMainWindow()
    })

    app.on('will-quit', () => {
        log.info('will-quit')
        /**
         * Remove URI scheme protocol handlers in development
         */
        if (process.env.NODE_ENV === 'development') {
            logger.debug('Disabling protocol handlers')
            disableHandler()
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
