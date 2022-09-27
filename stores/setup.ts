import {
    derived as svelteDerived,
    readable as svelteReadable,
    Unsubscriber,
    writable as svelteWritable,
} from 'svelte/store'
import type {Writable} from 'svelte/store'
import {PrimaryStore, ReplicatedStore} from 'svelte-channel-store'

import {encode, decode} from './helpers'

const isMain = typeof window === 'undefined'

const options = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    encode: (value: any) => {
        if (Array.isArray(value)) {
            return value.map(encode)
        }
        return encode(value)
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    decode: (value: any) => {
        if (Array.isArray(value)) {
            return value.map(decode)
        }
        return decode(value)
    },
}

export function setupReadable<T>(name: string, initialValue?: T): Writable<T> {
    // TODO: we don't need to setup a new channel for each store. do a check and setup only once
    if (isMain) {
        const store = new PrimaryStore<T>(name, svelteReadable(initialValue), options)
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require('electron').ipcMain.on('store', (event, storeName) => {
            if (storeName !== name) {
                return
            }
            const port = event.ports[0] as any
            // fix electrons broken port implementation
            port.addEventListener = (name: any, fn: any) => port.addListener(name, fn)
            port.removeEventListener = (name: any, fn: any) => port.removeListener(name, fn)
            store.attach(port)
        })
        return store
    } else {
        const channel = new MessageChannel()
        const store = new ReplicatedStore<T>(name, svelteReadable(initialValue), options)
        store.attach(channel.port2)
        window.postMessage({type: 'store', port: channel.port1, name}, '*', [channel.port1])
        return store
    }
}

export function setupWritable<T>(name: string, initialValue?: T): Writable<T> {
    // TODO: we don't need to setup a new channel for each store. do a check and setup only once
    if (isMain) {
        console.log('Setting up writable store in main process named:', name)
        const store = new PrimaryStore<T>(name, svelteWritable(initialValue), options)
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require('electron').ipcMain.on('store', (event, storeName) => {
            if (storeName !== name) {
                return
            }
            const port = event.ports[0] as any
            // fix electrons broken port implementation
            port.addEventListener = (name: any, fn: any) => port.addListener(name, fn)
            port.removeEventListener = (name: any, fn: any) => port.removeListener(name, fn)
            store.attach(port)
        })
        return store
    } else {
        console.log('Setting up writable store in renderer process named:', name)
        const channel = new MessageChannel()
        const store = new ReplicatedStore<T>(name, svelteWritable(initialValue), options)
        store.attach(channel.port2)
        window.postMessage({type: 'store', port: channel.port1, name}, '*', [channel.port1])
        return store
    }
}

export function setupDerived<T>(
    name: string,
    stores: any,
    fn: (values: unknown, set: (value: T) => void) => void | Unsubscriber
): Writable<T> {
    // TODO: we don't need to setup a new channel for each store. do a check and setup only once
    if (isMain) {
        const store = new PrimaryStore<T>(name, svelteDerived(stores, fn), options)
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require('electron').ipcMain.on('store', (event, storeName) => {
            if (storeName !== name) {
                return
            }
            const port = event.ports[0] as any
            // fix electrons broken port implementation
            port.addEventListener = (name: any, fn: any) => port.addListener(name, fn)
            port.removeEventListener = (name: any, fn: any) => port.removeListener(name, fn)
            store.attach(port)
        })
        return store
    } else {
        const channel = new MessageChannel()
        const store = new ReplicatedStore<T>(name, svelteDerived(stores, fn), options)
        store.attach(channel.port2)
        window.postMessage({type: 'store', port: channel.port1, name}, '*', [channel.port1])
        return store
    }
}
