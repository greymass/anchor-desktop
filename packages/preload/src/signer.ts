import {ipcRenderer} from 'electron'

import events from '@types/events'
import {Checksum256} from '@greymass/eosio'

export const signer = {
    signDigest: (digest: Checksum256) => ipcRenderer.invoke(events.SIGN_DIGEST, digest),
}
