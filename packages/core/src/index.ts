import {app} from 'electron'

import '~/modules/security'
import {createMainWindow} from '~/windows/main'
import {createSignerWindow} from '~/windows/signer'
import {enableHandler} from '~/modules/handler'
import {log as logger} from '~/modules/log'
// import {APIClient, FetchProvider, Name, Serializer} from '@greymass/eosio'
// import fetch from 'node-fetch'
// import {sharedInfo} from '../../stores'

const log = logger.scope('core')

// setup shared svelte stores
import '@stores'

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
    })

    app.on('ready', async () => {
        enableHandler()
        createMainWindow()
        createSignerWindow()
        // setInterval(async () => {
        //     const provider = new FetchProvider('https://eos.greymass.com', {fetch})
        //     const client = new APIClient({provider})
        //     const result = await client.v1.chain.get_info()
        //     sharedInfo.set(result)
        // }, 2500)
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
