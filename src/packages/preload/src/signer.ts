import {ipcRenderer} from 'electron'

import {debugPassword} from '@stores/debug'
import events from '@types/events'
import {Checksum256, PrivateKeyType, PublicKeyType} from '@wharfkit/antelope'

export const signer = {
    importKey: (privateKey: PrivateKeyType, password: string = debugPassword) =>
        ipcRenderer.invoke(events.SIGNER_IMPORT_BY_PRIVATE_KEY, privateKey, password),
    lock: () => ipcRenderer.invoke(events.SIGNER_LOCK),
    removeKey: (publicKey: PublicKeyType) =>
        ipcRenderer.invoke(events.SIGNER_REMOVE_BY_PUBLIC_KEY, publicKey),
    setPassword: (password: string) => ipcRenderer.invoke(events.SIGNER_SET_PASSWORD, password),
    signDigest: (digest: Checksum256) => ipcRenderer.invoke(events.SIGNER_SIGN_DIGEST, digest),
    unlock: (password: string) => ipcRenderer.invoke(events.SIGNER_UNLOCK, password),
    validatePassword: (password: string) =>
        ipcRenderer.invoke(events.SIGNER_VALIDATE_PASSWORD, password),
}
