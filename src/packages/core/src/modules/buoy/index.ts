import {
    Bytes,
    Checksum512,
    PrivateKey,
    PublicKey,
    Serializer,
    TimePointSec,
    UInt64,
} from '@wharfkit/antelope'
import {Listener, ListenerEncoding} from '@greymass/buoy'
import {AES_CBC} from 'asmcrypto.js'
import {ipcMain} from 'electron'
import WebSocket from 'ws'
import crypto from 'crypto'

import {sessions} from '@stores/session'

import {IdentityRequestParams, SessionParams} from '@types'
import events from '@types/events'

import {handleRequest} from '~/modules/esr'
import {log as logger} from '~/modules/log'
import {BuoySession, BuoySessionType, SealedMessage} from '~/modules/buoy/session'
import {storage} from '~/modules/storage'

const log = logger.scope('buoy')

export default class BuoyService {
    listener: Listener

    constructor() {
        log.info('Starting Buoy service...')
        const config = this.getConfig()
        this.listener = new Listener({
            autoConnect: true,
            channel: config.linkId,
            service: config.linkUrl,
            encoding: ListenerEncoding.binary,
            WebSocket,
        })
        this.setupEventHandlers()
    }

    setupEventHandlers() {
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

        // Unseal the message using the session managers request key
        const unsealed = unsealMessage(
            message.ciphertext,
            PrivateKey.from(config.requestKey),
            message.from,
            message.nonce
        )

        // Ensure an active session for this key exists in storage
        const sessionStorage: BuoySession[] = storage.get('sessions')
        const session = sessionStorage.find((s) => message.from.equals(s.publicKey))
        if (!session) {
            throw new Error(`Unknown session using ${message.from}`)
        }

        // Updating session lastUsed timestamp
        session.updateLastUsed(TimePointSec.fromDate(new Date()))

        // Create the signer window and pass the data
        handleRequest(unsealed)

        // Return the unsealed message
        return unsealed
    }

    getConfig() {
        let config = storage.get('connections')
        if (config) {
            log.debug('Using existing configuration:', config)
        } else {
            config = {
                linkUrl: 'https://cb.anchor.link',
                sessions: [],
                linkId: crypto.randomUUID(),
                requestKey: String(PrivateKey.generate('K1')),
            }
            log.debug('New configuration created:', config)
            storage.set('connections', config)
        }
        return config
    }

    addSessionFromIdentity(request: IdentityRequestParams) {
        log.debug('Adding new session', request)
        // Create the new session from the identity request
        const session = BuoySession.fromIdentityRequest(
            request.network,
            request.actor,
            request.permission,
            request.payload
        )
        // Now add the Session
        this.addSession(session)
    }

    addSession(data: BuoySessionType) {
        const session = BuoySession.from(data)
        log.debug('Adding new session', session)
        // Retrieve Sessions from storage
        const sessionStorage = this.getSessions()
        // Check if the session already exists
        const existingIndex = sessionStorage.findIndex((s: BuoySessionType) =>
            BuoySession.from(s).equals(session)
        )
        if (existingIndex >= 0) {
            // Update the existing session
            sessionStorage.splice(existingIndex, 1, session)
        } else {
            // Add the new session
            sessionStorage.push(session)
        }
        // Update storage
        storage.set('sessions', sessionStorage)
        // Update svelte store
        sessions.set(sessionStorage)
    }

    removeSession(data: SessionParams) {
        log.debug('Removing existing session', data)
        // Retrieve Sessions from storage
        const sessionStorage = this.getSessions()
        // Filter out the session to remove
        sessionStorage.filter((s: BuoySessionType) => !BuoySession.from(s).equals(data))
        // Update storage
        storage.set('sessions', sessionStorage)
        // Update svelte store
        sessions.set(sessionStorage)
    }

    getSessions() {
        return storage.get('sessions') || []
    }
}

export const enableSocket = () => {
    // Create new Session Manager
    const service = new BuoyService()
    // Establish IBC events
    ipcMain.on(events.SESSION_ADD_IDENTITY, (e: unknown, args) =>
        service.addSessionFromIdentity(args)
    )
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
    // Update the svelte store
    sessions.set(service.getSessions())
}

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
