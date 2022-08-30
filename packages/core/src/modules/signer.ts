import {ipcMain, IpcMainInvokeEvent} from 'electron'
import {Checksum256} from '@greymass/eosio'

import events from '@types/events'
import {log as logger} from '~/modules/log'
import {privateKey} from '@stores/debug'

const log = logger.scope('signer')

function handleSignDigest(event: IpcMainInvokeEvent, digest: Checksum256): string {
    log.debug('Signing digest', digest)
    const signature = privateKey.signDigest(digest)
    return String(signature)
}

export const enableSigner = () => {
    log.debug('Registering IBC events')
    ipcMain.handle(events.SIGN_DIGEST, handleSignDigest)
}
