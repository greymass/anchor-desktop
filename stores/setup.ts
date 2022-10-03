import {
    derived as svelteDerived,
    Readable,
    readable as svelteReadable,
    StartStopNotifier,
    Unsubscriber,
    writable as svelteWritable,
    Writable,
} from 'svelte/store'
import {PrimaryStore, ReplicatedStore} from 'svelte-channel-store'

import {encode, decode} from './helpers'

const isMain = typeof window === 'undefined'

const G: any =
    typeof globalThis !== 'undefined'
        ? globalThis
        : typeof global !== 'undefined'
        ? global
        : typeof window !== 'undefined'
        ? window
        : null

if (G === null) {
    throw new Error('Unable to find global object')
}

G.__STORES = G.__STORES || {}

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

export function setupReadable<T>(name: string, initialValue?: T): PrimaryStore<T> {
    // TODO: we don't need to setup a new channel for each store. do a check and setup only once
    let store: PrimaryStore<T> | ReplicatedStore<T> | undefined = G.__STORES[name]
    if (!store) {
        if (isMain) {
            console.log('Setting up writable store in main process named:', name)
            store = new PrimaryStore<T>(name, svelteReadable(initialValue), options)
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            require('electron').ipcMain.on('store', (event, storeName) => {
                if (storeName !== name) {
                    return
                }
                const port = event.ports[0] as any
                // fix electrons broken port implementation
                port.addEventListener = (name: any, fn: any) => port.addListener(name, fn)
                port.removeEventListener = (name: any, fn: any) => port.removeListener(name, fn)
                store!.attach(port)
            })
        } else {
            console.log('Setting up writable store in renderer process named:', name)
            const channel = new MessageChannel()
            store = new ReplicatedStore<T>(name, svelteReadable(initialValue), options)
            store.attach(channel.port2)
            window.postMessage({type: 'store', port: channel.port1, name}, '*', [channel.port1])
        }
        G.__STORES[name] = store
    }
    return store
}

export function setupWritable<T>(name: string, initialValue?: T): Writable<T> {
    // TODO: we don't need to setup a new channel for each store. do a check and setup only once
    let store: PrimaryStore<T> | ReplicatedStore<T> | undefined = G.__STORES[name]
    if (!store) {
        if (isMain) {
            console.log('Setting up writable store in main process named:', name)
            store = new PrimaryStore<T>(name, svelteWritable(initialValue), options)
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            require('electron').ipcMain.on('store', (event, storeName) => {
                if (storeName !== name) {
                    return
                }
                const port = event.ports[0] as any
                // fix electrons broken port implementation
                port.addEventListener = (name: any, fn: any) => port.addListener(name, fn)
                port.removeEventListener = (name: any, fn: any) => port.removeListener(name, fn)
                store!.attach(port)
            })
        } else {
            console.log('Setting up writable store in renderer process named:', name)
            const channel = new MessageChannel()
            store = new ReplicatedStore<T>(name, svelteWritable(initialValue), options)
            store.attach(channel.port2)
            window.postMessage({type: 'store', port: channel.port1, name}, '*', [channel.port1])
        }
        G.__STORES[name] = store
    }
    return store
}

export function setupDerived<T>(
    name: string,
    stores: any,
    fn: StartStopNotifier<any>
): Writable<T> {
    // TODO: we don't need to setup a new channel for each store. do a check and setup only once
    let store: PrimaryStore<T> | ReplicatedStore<T> | undefined = G.__STORES[name]
    if (!store) {
        if (isMain) {
            console.log('Setting up writable store in main process named:', name)
            store = new PrimaryStore<T>(name, svelteWritable(stores, fn), options)
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            require('electron').ipcMain.on('store', (event, storeName) => {
                if (storeName !== name) {
                    return
                }
                const port = event.ports[0] as any
                // fix electrons broken port implementation
                port.addEventListener = (name: any, fn: any) => port.addListener(name, fn)
                port.removeEventListener = (name: any, fn: any) => port.removeListener(name, fn)
                store!.attach(port)
            })
        } else {
            console.log('Setting up writable store in renderer process named:', name)
            const channel = new MessageChannel()
            store = new ReplicatedStore<T>(name, svelteWritable(stores, fn), options)
            store.attach(channel.port2)
            window.postMessage({type: 'store', port: channel.port1, name}, '*', [channel.port1])
        }
        G.__STORES[name] = store
    }
    return store
}
