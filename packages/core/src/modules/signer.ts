import {ipcMain, IpcMainInvokeEvent} from 'electron'
import {Checksum256, PrivateKey, PrivateKeyType, PublicKey, PublicKeyType} from '@greymass/eosio'

import {KeyStore} from '@types'
import events from '@types/events'

import {privateKey} from '@stores/debug'
import {publicKeys} from '@stores/signer'

import {log as logger} from '~/modules/log'
import {encrypt} from '~/modules/encryption'
import {storage} from '~/modules/storage'
import {decrypt} from './encryption'

const log = logger.scope('signer')

const defaultKeystore: KeyStore = {
    hardwareKeys: {},
    publicKeys: [],
    privateKeys: [],
}

function handleSignDigest(event: IpcMainInvokeEvent, digest: Checksum256): string {
    log.debug('Signing digest', digest)
    const signature = privateKey.signDigest(digest)
    return String(signature)
}

function handlePrivateKeyImport(
    event: IpcMainInvokeEvent,
    privateKey: PrivateKeyType,
    password: string
) {
    log.debug('Private Key Import', privateKey)
    const key = PrivateKey.from(privateKey)
    // Load the keystore
    const store = storage.get('keystore', defaultKeystore)
    // Decrypt private key storage for use
    store.privateKeys = JSON.parse(decrypt(store.privateKeys, password))
    // Check to see if key exists, if not, append
    if (!store.privateKeys.includes(String(key))) {
        store.publicKeys.push(String(key.toPublic()))
        store.privateKeys.push(String(key))
    }
    // Encrypt private key storage
    store.privateKeys = encrypt(JSON.stringify(store.privateKeys), password)
    // Save the keystore
    storage.set('keystore', store)
    // Update available public keys
    publicKeys.set(store.publicKeys)
}

function handleRemovePublicKey(
    event: IpcMainInvokeEvent,
    publicKey: PublicKeyType,
    password: string
) {
    log.debug('Public/Private Key Remove', publicKey)
    // Load the keystore
    const store = storage.get('keystore', defaultKeystore)
    // Decrypt private key storage for use
    store.privateKeys = JSON.parse(decrypt(store.privateKeys, password))
    // Remove matching public keys
    const pubIndex = store.publicKeys.indexOf(publicKey)
    if (pubIndex > -1) {
        store.publicKeys.splice(pubIndex, 1)
    }
    // Remove any matching private key
    const pubKey = PublicKey.from(publicKey)
    const privateKeys = store.privateKeys.filter((key: PrivateKeyType) => {
        return !PrivateKey.from(key).toPublic().equals(pubKey)
    })
    // Encrypt private key storage
    store.privateKeys = encrypt(JSON.stringify(privateKeys), password)
    // Save the keystore
    storage.set('keystore', store)
    // Update available public keys
    publicKeys.set(store.publicKeys)
}

export function getPublicKeys(): PublicKeyType[] {
    const store = storage.get('keystore', defaultKeystore)
    return store ? store.publicKeys : []
}

export const enableSigner = () => {
    log.debug('Registering IBC events')
    ipcMain.handle(events.SIGNER_SIGN_DIGEST, handleSignDigest)
    ipcMain.handle(events.SIGNER_IMPORT_PRIVATE_KEY, handlePrivateKeyImport)
    ipcMain.handle(events.SIGNER_REMOVE_PUBLIC_KEY, handleRemovePublicKey)
    log.debug('Loading data into stores')
    publicKeys.set(getPublicKeys())
}
