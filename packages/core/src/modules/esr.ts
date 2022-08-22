import {BrowserWindow} from 'electron'
import {log as logger} from '~/modules/log'
import events from '@types/events'

export function handleRequest(payload: string, signerWindowId: number) {
    logger.debug('handleRequest', {payload, signerWindowId})
    const instance = BrowserWindow.fromId(signerWindowId)
    instance?.webContents.send(events.SIGNING_REQUEST_RECEIVED, payload)
    instance?.show()
}
