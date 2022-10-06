/**
 * @module preload
 */
import {contextBridge, ipcRenderer} from 'electron'

import events from '@types/events'

import './nodeCrypto'
import './versions'
import {accounts} from './accounts'
import {sessions} from './sessions'
import {signer} from './signer'

// forward store port setup to main process
window.addEventListener('message', (event) => {
    if (event.data.type === 'store') {
        ipcRenderer.postMessage('store', event.data.name, [event.data.port])
    }
})

export const anchor = {
    accounts,
    cancelRequest: () => ipcRenderer.send(events.SIGNING_REQUEST_CANCELLED),
    exampleRequest: () => ipcRenderer.send(events.SIGNING_REQUEST_EXAMPLE),
    wipe: async (password: string) => ipcRenderer.invoke(events.ANCHOR_FACTORY_RESET, password),
    signer,
    sessions,
}

contextBridge.exposeInMainWorld('anchor', anchor)
