import {ipcRenderer} from 'electron'

import {debugPassword} from '@stores/debug'
import events from '@types/events'
import {Checksum256, PrivateKeyType, PublicKeyType} from '@greymass/eosio'

export const signer = {
    importPrivateKey: (privateKey: PrivateKeyType) =>
        ipcRenderer.invoke(events.SIGNER_IMPORT_PRIVATE_KEY, privateKey, debugPassword),
    removePublicKey: (publicKey: PublicKeyType) =>
        ipcRenderer.invoke(events.SIGNER_REMOVE_PUBLIC_KEY, publicKey, debugPassword),
    signDigest: (digest: Checksum256) => ipcRenderer.invoke(events.SIGNER_SIGN_DIGEST, digest),
}
