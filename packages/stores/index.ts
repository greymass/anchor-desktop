import {Writable, writable} from 'svelte/store'
import {PrimaryStore, ReplicatedStore} from 'svelte-channel-store'

const isMain = typeof window === 'undefined'

function setupStore<T>(name: string, initialValue: T): Writable<T> {
    // TODO: we don't need to setup a new channel for each store. do a check and setup only once
    if (isMain) {
        const store = new PrimaryStore<T>(name, writable(initialValue))
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
        const store = new ReplicatedStore<T>(name, writable(initialValue))
        store.attach(channel.port2)
        window.postMessage({type: 'store', port: channel.port1, name}, '*', [channel.port1])
        return store
    }
}

export const sharedCounter = setupStore('sharedCounter', 0)
