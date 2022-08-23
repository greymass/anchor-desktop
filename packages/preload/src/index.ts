/**
 * @module preload
 */
import {contextBridge, ipcRenderer} from 'electron'
import {Checksum256} from '@greymass/eosio'

import events from '@types/events'

import './nodeCrypto'
import './versions'

// forward store port setup to main process
window.addEventListener('message', (event) => {
    if (event.data.type === 'store') {
        ipcRenderer.postMessage('store', event.data.name, [event.data.port])
    }
})

contextBridge.exposeInMainWorld('anchor', {
    cancelRequest: () => ipcRenderer.send(events.SIGNING_REQUEST_CANCELLED),
    exampleRequest: () => ipcRenderer.send(events.SIGNING_REQUEST_EXAMPLE),
    signDigest: (digest: Checksum256) => ipcRenderer.invoke(events.SIGN_DIGEST, digest),
})
