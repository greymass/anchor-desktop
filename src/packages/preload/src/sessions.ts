import {ipcRenderer} from 'electron'

import {IdentityRequestParams, SessionParams} from '@types'
import events from '@types/events'

export const sessions = {
    addFromIdentity: (session: IdentityRequestParams) =>
        ipcRenderer.send(events.SESSION_ADD_IDENTITY, session),
    remove: (session: SessionParams) => ipcRenderer.send(events.SESSION_REMOVE, session),
    config: () => ipcRenderer.invoke(events.SESSION_CONFIG),
}
