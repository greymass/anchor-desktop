import {ipcMain, IpcMainInvokeEvent} from 'electron'
import {Checksum256, PrivateKey, PrivateKeyType, PublicKey, PublicKeyType} from '@wharfkit/antelope'

import {KeyStore} from '@types'
import events from '@types/events'

import {privateKey} from '@stores/debug'
import {hash, initialized, publicKeys, unlocked} from '@stores/signer'

import {log as logger} from '~/modules/log'
import {decrypt, encrypt} from '~/modules/encryption'
import {storage} from '~/modules/storage'

const log = logger.scope('signer')

const defaultKeystore: KeyStore = {
    hardwareKeys: {},
    publicKeys: [],
    privateKeys: null,
}

interface Signer {
    keys: Record<string, PrivateKey>
    password: string | undefined
    updateKeys: (keys: PrivateKeyType[]) => void
}

const signer: Signer = {
    keys: {},
    password: undefined,
    updateKeys(keys: PrivateKeyType[]) {
        this.keys = keys.reduce((keys, key) => {
            const privateKey = PrivateKey.from(key)
            const publicKey = String(privateKey.toPublic())
            keys[publicKey] = privateKey
            return keys
        }, {})
    },
}

function handleSignDigest(event: IpcMainInvokeEvent, digest: Checksum256): string {
    log.debug('Signing digest', digest)
    const signature = privateKey.signDigest(digest)
    return String(signature)
}

function handleImportByPrivateKey(event: IpcMainInvokeEvent, privateKey: PrivateKeyType) {
    log.debug('handleImportByPrivateKey')
    if (signer.password) {
        const key = PrivateKey.from(privateKey)
        // Load the keystores
        const store = storage.get('keystore', defaultKeystore)
        // Decrypt private key storage for use
        store.privateKeys = decryptKeystore(store.privateKeys, signer.password)
        // Check if the public key is already imported
        if (!store.publicKeys.includes(key.toPublic().toString())) {
            // Add the public key to the list
            store.publicKeys.push(String(key.toPublic()))
            // Update available public keys
            publicKeys.set(store.publicKeys)
        }
        // Check to see if key doesn't exists
        if (!store.privateKeys.includes(String(key))) {
            // Add private key to list
            store.privateKeys.push(String(key))
            // Add private key to available keys to use for signing
            signer.updateKeys(store.privateKeys)
        }
        // Encrypt private key storage
        store.privateKeys = encrypt(JSON.stringify(store.privateKeys), signer.password)
        // Save the store
        storage.set('keystore', store)
    }
}

function handleRemoveByPublicKey(event: IpcMainInvokeEvent, publicKey: PublicKeyType) {
    log.debug('handleRemoveByPublicKey', publicKey)
    if (signer.password) {
        // Load the keystore
        const store = storage.get('keystore', defaultKeystore)
        // Decrypt private key storage for use
        store.privateKeys = decryptKeystore(store.privateKeys, signer.password)
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
        // Update the available keys within the signer
        signer.updateKeys(privateKeys)
        // Encrypt private key storage
        store.privateKeys = encrypt(JSON.stringify(privateKeys), signer.password)
        // Save the keystore
        storage.set('keystore', store)
        // Update available public keys
        publicKeys.set(store.publicKeys)
    }
}

export function getPublicKeys(): PublicKeyType[] {
    const store = storage.get('keystore', defaultKeystore)
    return store ? store.publicKeys : []
}

export function getInitializationState(): boolean {
    const store = storage.get('initialized', false)
    return store
}

export function handleUnlockSigner(event: IpcMainInvokeEvent, password: string) {
    const valid = validatePassword(password)
    if (valid) {
        // Update svelte store to indicate unlocked
        unlocked.set(true)
        // Store the password within the signer for future use
        signer.password = password
        // Unlock the keys
        const store = storage.get('keystore', defaultKeystore)
        const keys = decryptKeystore(store.privateKeys, signer.password)
        signer.updateKeys(keys)
    }
}

function decryptKeystore(keystore: unknown, password: string) {
    try {
        const decrypted = decrypt(keystore, password)
        return JSON.parse(decrypted)
    } catch (error) {
        return []
    }
}

export function validatePassword(password: string) {
    const {deviceId, hash} = storage.get()
    try {
        const decrypted = decrypt(hash, password, 100)
        return decrypted === deviceId
    } catch (error) {
        return false
    }
}

export function handleLockSigner() {
    signer.keys = []
    signer.password = undefined
    unlocked.set(false)
}

export function handleSetPassword(event: IpcMainInvokeEvent, password: string) {
    const init = storage.get('initialized')
    if (!init) {
        setNewPassword(password)
    }
}

function setNewPassword(password: string) {
    const deviceId = storage.get('deviceId')
    const hash = encrypt(deviceId, password, 100)
    storage.set('hash', hash)
    storage.set('initialized', true)
    initialized.set(true)
    unlocked.set(true)
    signer.password = password
}

export function loadSignerData() {
    const store = storage.get('hash', 'not set')
    hash.set(store)
    initialized.set(getInitializationState())
    publicKeys.set(getPublicKeys())
}

export const enableSigner = () => {
    log.debug('Registering IBC events')
    ipcMain.handle(events.SIGNER_IMPORT_BY_PRIVATE_KEY, handleImportByPrivateKey)
    ipcMain.handle(events.SIGNER_LOCK, handleLockSigner)
    ipcMain.handle(events.SIGNER_REMOVE_BY_PUBLIC_KEY, handleRemoveByPublicKey)
    ipcMain.handle(events.SIGNER_SET_PASSWORD, handleSetPassword)
    ipcMain.handle(events.SIGNER_SIGN_DIGEST, handleSignDigest)
    ipcMain.handle(events.SIGNER_UNLOCK, handleUnlockSigner)
    ipcMain.handle(events.SIGNER_VALIDATE_PASSWORD, (e: IpcMainInvokeEvent, password: string) =>
        validatePassword(password)
    )
    log.debug('Loading data into stores')
    loadSignerData()
}
