import {Bytes, Checksum512, PrivateKey, PublicKey, Serializer, UInt64} from '@wharfkit/antelope'
import {Listener, ListenerEncoding} from '@greymass/buoy'
import {AES_CBC} from 'asmcrypto.js'
import fetch from 'node-fetch'
import {ipcMain} from 'electron'
import WebSocket from 'ws'
import crypto from 'crypto'

import {sessions} from '@stores/session'
import {IdentityRequestParams, SessionParams} from '@types'
import events from '@types/events'
import {log as logger} from '~/modules/log'
import {storage} from '~/modules/storage'
import {handleRequest} from './esr'
import {BuoySession, SealedMessage} from './session'
import {get} from 'svelte/store'
import {activeRequest} from '@stores/request'
import {createSignerWindow} from '../../../../core/src/windows/signer'

const log = logger.scope('socket')

export default class BuoyService {
    listener: Listener
    // manager: AnchorLinkSessionManager
    // storage: AnchorLinkSessionManagerStorage
    // handler: AnchorLinkSessionManagerEventHander

    constructor() {
        log.info('Starting buoy socket...')

        this.setupListener()
        // this.handler = this.createHandler()
        // const config = this.getConfig()
        // sessions.set(config.sessions)
        // this.storage = new AnchorLinkSessionManagerStorage(config)
        // this.manager = new AnchorLinkSessionManager({
        //     handler: this.handler,
        //     storage: this.storage,
        //     WebSocket,
        // })
    }
    setupListener() {
        const config = this.getConfig()
        logger.debug('setup listener...', config)
        const service = 'https://cb.anchor.link'

        const options = {channel: config.linkId, service, fetch, WebSocket}
        this.listener = new Listener({
            ...options,
            encoding: ListenerEncoding.binary,
            autoConnect: true,
        })

        this.listener.on('message', (data) => this.handleMessage(data))
    }
    async handleMessage(data: Buffer) {
        logger.debug('handleMessage', data.toString('hex'))
        const config = this.getConfig()
        // Decode the incoming message
        const message = Serializer.decode({
            type: SealedMessage,
            data,
        })
        console.log('message', message)

        // Unseal the message using the session managers request key
        const unsealed = unsealMessage(
            message.ciphertext,
            PrivateKey.from(config.requestKey),
            message.from,
            message.nonce
        )

        console.log('unsealed', unsealed)

        // Ensure an active session for this key exists in storage
        const sessionStorage: BuoySession[] = storage.get('sessions')
        const recognized = sessionStorage.find((s) => message.from.equals(s.publicKey))
        if (!recognized) {
            throw new Error(`Unknown session using ${message.from}`)
        }

        // Updating session lastUsed timestamp
        // this.updateLastUsed(message.from)

        // Fire callback for onIncomingRequest defined by client application
        // this.handler.onIncomingRequest(unsealed)

        const instance = await createSignerWindow()
        // instance?.webContents.send(events.SIGNING_REQUEST_RECEIVED, payload)
        instance?.show()
        activeRequest.set(unsealed)

        // Return the unsealed message
        return unsealed
    }
    getConfig() {
        let config = storage.get('connections')
        if (config) {
            log.debug('Using existing configuration:', config)
        } else {
            config = {
                linkUrl: 'cb.anchor.link',
                sessions: [],
                linkId: crypto.randomUUID(),
                requestKey: String(PrivateKey.generate('K1')),
            }
            log.debug('New configuration created:', config)
            storage.set('connections', config)
        }
        return config
    }
    getSessions() {
        return storage.get('sessions') || []
    }
    addSession(request: IdentityRequestParams) {
        log.debug('Adding new session', request)
        const sessionStorage = this.getSessions()
        const session = BuoySession.fromIdentityRequest(
            request.network,
            request.actor,
            request.permission,
            request.payload
        )
        const existingIndex = sessionStorage.findIndex((s) => {
            const matchingNetwork = session.network.equals(s.network)
            const matchingActor = session.actor.equals(s.actor)
            const matchingPermissions = session.permission.equals(s.permission)
            const matchingAppName = session.name.equals(s.name)
            return matchingNetwork && matchingActor && matchingPermissions && matchingAppName
        })
        if (existingIndex >= 0) {
            sessionStorage.splice(existingIndex, 1, session)
        } else {
            sessionStorage.push(session)
        }
        logger.debug('sessions', sessions)
        storage.set('sessions', sessionStorage)
        sessions.set(sessionStorage)
    }
    removeSession(data: SessionParams) {
        log.debug('Removing existing session', data)
        // const session = AnchorLinkSessionManagerSession.from({
        //     network: data.network,
        //     actor: data.actor,
        //     permission: data.permission,
        //     publicKey: data.publicKey,
        //     name: data.name,
        // })
        // this.manager.removeSession(session)
    }
    // createHandler() {
    //     return {
    //         onStorageUpdate(json: string) {
    //             log.debug('Called onStorageUpdate', json, storage)
    //             const data = JSON.parse(json)
    //             storage.set('connections', data)
    //             sessions.set(data.sessions)
    //         },
    //         onIncomingRequest(payload: string) {
    //             log.debug('Called onIncomingRequest', payload)
    //             handleRequest(payload)
    //         },
    //     }
    // }
}

export const enableSocket = () => {
    // Create new Session Manager
    const service = new BuoyService()
    // Connect the session manager
    // service.manager.connect()
    // Establish IBC events
    ipcMain.on(events.SESSION_ADD, (e: unknown, args) => service.addSession(args))
    ipcMain.on(events.SESSION_REMOVE, (e: unknown, args) => service.removeSession(args))
    // Request for configuration
    ipcMain.handle(events.SESSION_CONFIG, async () => {
        const {linkId, linkUrl, requestKey} = service.getConfig()
        return {
            linkId,
            linkUrl,
            requestKey: String(PrivateKey.from(requestKey).toPublic()),
        }
    })
    logger.debug(service.getSessions())
    sessions.set(service.getSessions())
    console.log('sessions', get(sessions))
}
// return service

/**
 * Encrypt a message using AES and shared secret derived from given keys.
 * @internal
 */
export function unsealMessage(
    message: Bytes,
    privateKey: PrivateKey,
    publicKey: PublicKey,
    nonce: UInt64
): string {
    const secret = privateKey.sharedSecret(publicKey)
    const key = Checksum512.hash(Serializer.encode({object: nonce}).appending(secret.array))
    const cbc = new AES_CBC(key.array.slice(0, 32), key.array.slice(32, 48))
    const ciphertext = Bytes.from(cbc.decrypt(message.array))
    return ciphertext.toString('utf8')
}
