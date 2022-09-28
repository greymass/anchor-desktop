import {
    AnchorLinkSessionManager,
    AnchorLinkSessionManagerEventHander,
    AnchorLinkSessionManagerSession,
    AnchorLinkSessionManagerStorage,
} from '@greymass/anchor-link-session-manager'
import {PrivateKey} from '@greymass/eosio'
import {ipcMain} from 'electron'
import WebSocket from 'ws'
import crypto from 'crypto'

import {sessions} from '@stores/session'
import {IdentityRequestParams, SessionParams} from '@types'
import events from '@types/events'
import {log as logger} from '~/modules/log'
import {storage} from '~/modules/storage'
import {handleRequest} from './esr'

const log = logger.scope('socket')

export default class SessionManager {
    manager: AnchorLinkSessionManager
    storage: AnchorLinkSessionManagerStorage
    handler: AnchorLinkSessionManagerEventHander

    constructor() {
        log.info('Started')
        this.handler = this.createHandler()
        const config = this.getConfig()
        sessions.set(config.sessions)
        this.storage = new AnchorLinkSessionManagerStorage(config)
        this.manager = new AnchorLinkSessionManager({
            handler: this.handler,
            storage: this.storage,
            WebSocket,
        })
    }
    getConfig(): AnchorLinkSessionManagerStorage {
        let config = storage.get('buoy')
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
        }
        return AnchorLinkSessionManagerStorage.unserialize(JSON.stringify(config))
    }
    addSession(request: IdentityRequestParams) {
        log.debug('Adding new session', request)
        const session = AnchorLinkSessionManagerSession.fromIdentityRequest(
            request.network,
            request.actor,
            request.permission,
            request.payload
        )
        this.manager.addSession(session)
    }
    removeSession(data: SessionParams) {
        log.debug('Removing existing session', data)
        const session = AnchorLinkSessionManagerSession.from({
            network: data.network,
            actor: data.actor,
            permission: data.permission,
            publicKey: data.publicKey,
            name: data.name,
        })
        this.manager.removeSession(session)
    }
    createHandler() {
        return {
            onStorageUpdate(json: string) {
                log.debug('Called onStorageUpdate', json, storage)
                const data = JSON.parse(json)
                storage.set('buoy', data)
                sessions.set(data.sessions)
            },
            onIncomingRequest(payload: string) {
                log.debug('Called onIncomingRequest', payload)
                handleRequest(payload)
            },
        }
    }
}

export const enableSocket = () => {
    log.debug('Registering IBC events')
    // Create new Session Manager
    const sHandler = new SessionManager()
    // Connect the session manager
    sHandler.manager.connect()
    // Establish IBC events
    ipcMain.on(events.SESSION_ADD, (e: unknown, args) => sHandler.addSession(args))
    ipcMain.on(events.SESSION_REMOVE, (e: unknown, args) => sHandler.removeSession(args))
    // Request for configuration
    ipcMain.handle(events.SESSION_CONFIG, async () => {
        const {linkId, linkUrl, requestKey} = sHandler.getConfig()
        return {
            linkId,
            linkUrl,
            requestKey: String(PrivateKey.from(requestKey).toPublic()),
        }
    })
    return sHandler
}
