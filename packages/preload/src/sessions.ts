import {ipcRenderer} from 'electron'
import {AnchorLinkSessionManagerSession} from '@greymass/anchor-link-session-manager'

import {IdentityRequestParams, SessionParams} from '@types'
import events from '@types/events'

export const sessions = {
    add: (session: IdentityRequestParams) => ipcRenderer.send(events.SESSION_ADD, session),
    remove: (session: SessionParams) => ipcRenderer.send(events.SESSION_REMOVE, session),
    config: () => ipcRenderer.invoke(events.SESSION_CONFIG),
}
