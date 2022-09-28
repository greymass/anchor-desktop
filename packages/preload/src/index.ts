/**
 * @module preload
 */
import {contextBridge, ipcRenderer} from 'electron'
import {Checksum256} from '@greymass/eosio'
import * as fs from 'fs'
import * as path from 'path'

import events from '@types/events'

import './nodeCrypto'
import './versions'
import {sessions} from './sessions'
import {signer} from './signer'

// forward store port setup to main process
window.addEventListener('message', (event) => {
    if (event.data.type === 'store') {
        ipcRenderer.postMessage('store', event.data.name, [event.data.port])
    }
})

export const anchor = {
    cancelRequest: () => ipcRenderer.send(events.SIGNING_REQUEST_CANCELLED),
    exampleRequest: () => ipcRenderer.send(events.SIGNING_REQUEST_EXAMPLE),
    init: () => ipcRenderer.send(events.ANCHOR_READY),
    signer,
    sessions,
}

contextBridge.exposeInMainWorld('anchor', anchor)
