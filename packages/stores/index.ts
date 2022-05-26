import {Writable, writable} from 'svelte/store'
import {PrimaryStore, ReplicatedStore} from 'svelte-channel-store'
import {Name, Serializer} from '@greymass/eosio'

const isMain = typeof window === 'undefined'

const options = {
    encode: (value) => (isCore(value) ? toRaw(value) : value),
    decode: (value) => (isRaw(value) ? toCore(value) : value),
}

function setupStore<T>(name: string, initialValue: T): Writable<T> {
    // TODO: we don't need to setup a new channel for each store. do a check and setup only once
    if (isMain) {
        const store = new PrimaryStore<T>(name, writable(initialValue), options)
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
        const store = new ReplicatedStore<T>(name, writable(initialValue), options)
        store.attach(channel.port2)
        window.postMessage({type: 'store', port: channel.port1, name}, '*', [channel.port1])
        return store
    }
}

interface CoreType {
    object: any
    type: string
}

const isCore = (data: any) => data && data.constructor && data.constructor.abiName
const toCore = ({object, type}: CoreType) => Serializer.decode({object, type})

const isRaw = (data: any) => data && data.type && data.object
const toRaw = (data: any) => ({
    object: Serializer.objectify(data),
    type: data.constructor.abiName,
})

export const sharedName = setupStore('sharedName', Name.from('foo'))
