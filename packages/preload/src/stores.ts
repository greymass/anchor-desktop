import {ipcRenderer} from 'electron'
import {writable} from 'svelte/store'
import type {Writable} from 'svelte/store'
import {exposeInMainWorld} from './exposeInMainWorld'

// Takes in and mutates a store from the backend
export async function getStore(store: Writable<any>, name: string) {
    // Retrieve the value of the store from the backend
    const result = await ipcRenderer.invoke('STORE_GET', name)
    // Set the value of the store to what was returned
    store.set(result)
    // Setup listener that future STORE_SYNC calls can use to update the value
    ipcRenderer.on('STORE_SYNC', (event, key, value) => {
        if (key === name) {
            store.set(value)
        }
    })
}

// Takes in a key and value and passes them to the backend to set
//      this will in turn trigger the STORE_SYNC listener on all stores loaded for this name
export async function setStore(name: string, value: any) {
    ipcRenderer.send('STORE_SET', name, value)
}

exposeInMainWorld('getStore', getStore)
exposeInMainWorld('setStore', setStore)
