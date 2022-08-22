import {BrowserWindow} from 'electron'

import events from '@types/events'

import {log as logger} from '~/modules/log'
import {createSignerWindow} from '~/windows/signer'

export async function handleRequest(payload: string) {
    logger.debug('handleRequest', payload)
    const instance = await createSignerWindow()
    instance?.webContents.send(events.SIGNING_REQUEST_RECEIVED, payload)
    instance?.show()
}
