import {
    AnchorLinkSessionManager,
    AnchorLinkSessionManagerEventHander,
    AnchorLinkSessionManagerSession,
    AnchorLinkSessionManagerStorage,
} from '@greymass/anchor-link-session-manager'
import {Checksum256Type, Name, PublicKey} from '@greymass/eosio'
import WebSocket from 'ws'

import {log as logger} from '~/modules/log'
import {storage} from '~/modules/storage'

const log = logger.scope('socket')

interface IdentityRequestParams {
    network: Checksum256Type
    actor: Name
    permission: Name
    payload: string
}

interface SessionParams {
    network: Checksum256Type
    actor: Name
    permission: Name
    publicKey: PublicKey
    name: string
}

export default class SessionManager {
    manager: AnchorLinkSessionManager
    storage: AnchorLinkSessionManagerStorage
    handler: AnchorLinkSessionManagerEventHander

    constructor() {
        log.info('Started')
        this.handler = this.createHandler()
        log.debug('Existing configuration found:', storage.get('buoy'))
        this.storage = new AnchorLinkSessionManagerStorage(storage.get('buoy'))
        this.manager = new AnchorLinkSessionManager({
            handler: this.handler,
            storage: this.storage,
            WebSocket,
        })
    }
    addSession(request: IdentityRequestParams) {
        const session = AnchorLinkSessionManagerSession.fromIdentityRequest(
            request.network,
            request.actor,
            request.permission,
            request.payload
        )
        this.manager.addSession(session)
    }
    removeSession(data: SessionParams) {
        const session = new AnchorLinkSessionManagerSession(
            data.network,
            data.actor,
            data.permission,
            data.publicKey,
            data.name
        )
        this.manager.removeSession(session)
    }
    createHandler() {
        // const {pHandler, store} = this
        // pHandler.webContents.send('sessionEvent', 'oncreate')
        log.debug('Creating Anchor event handlers')
        return {
            onStorageUpdate(json) {
                log.debug('Called onStorageUpdate', json, storage)
                // const storage = JSON.parse(json)
                // store.dispatch({
                //     type: types.SYSTEM_SESSIONS_SYNC,
                //     payload: storage,
                // })
            },
            onIncomingRequest(payload) {
                log.debug('Called onIncomingRequest', payload)
                // pHandler.webContents.send('openUri', payload)
                // pHandler.setVisibleOnAllWorkspaces(true)
                // pHandler.show()
                // pHandler.focus()
                // pHandler.setVisibleOnAllWorkspaces(false)
            },
            onSocketEvent(type, event) {
                log.debug('Called onSocketEvent', type, event)
                // if (pHandler && pHandler.webContents) {
                //     pHandler.webContents.send('sessionEvent', type, JSON.stringify(event))
                // }
            },
        }
    }
}

export const enableSocket = () => {
    // Create new Session Manager
    const sHandler = new SessionManager()
    // Connect the session manager
    sHandler.manager.connect()
}
