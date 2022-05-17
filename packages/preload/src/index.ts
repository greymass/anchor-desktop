/**
 * @module preload
 */

import './nodeCrypto'
import './versions'


import { ipcRenderer } from 'electron'

// forward store port setup to main process
window.addEventListener('message', (event) => {
    if (event.data.type === 'store') {
        ipcRenderer.postMessage('store', event.data.name, [event.data.port])
    }
})
