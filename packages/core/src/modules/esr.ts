import events from '@types/events'
import {activeRequest} from '@stores/request'

import {log as logger} from '~/modules/log'
import {createSignerWindow} from '~/windows/signer'
import {foo} from '@stores/debug'

const log = logger.scope('esr')

export async function handleRequest(payload: string) {
    log.debug('handleRequest', payload)
    const instance = await createSignerWindow()
    foo.set('baaaaar')
    instance?.webContents.send(events.SIGNING_REQUEST_RECEIVED, payload)
    instance?.show()
    activeRequest.set(payload)
}
