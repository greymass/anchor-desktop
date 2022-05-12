import {get, Subscriber, Unsubscriber, writable as _writable} from 'svelte/store'
import {Serializer} from '@greymass/eosio'

type StartStopNotifier<T> = (
    set: Subscriber<T>,
    error: Subscriber<Error>
) => Unsubscriber | Promise<T | void> | void

export class Writable<T> {
    key
    store

    constructor(value: any)
    constructor(value: any, key?: string)
    constructor(value: any, start?: StartStopNotifier<T> | undefined, key?: string)
    constructor(...args: any[]) {
        const value: any = args[0]
        let start: StartStopNotifier<T>
        let key: string | undefined
        if (args.length === 3) {
            start = args[1]
            key = args[2]
        } else {
            start = typeof args[1] === 'function' ? args[1] : noop
            key = typeof args[2] === 'string' ? args[2] : undefined
        }
        this.key = key
        if (isCore(value)) {
            this.store = _writable(toRaw(value), start)
        } else {
            this.store = _writable(value, start)
        }
    }

    set = (value: any) => {
        if (isCore(value)) {
            this.store.set(toRaw(value))
        } else {
            this.store.set(value)
        }
    }

    update(callback: any) {
        const update = (data: any) => {
            const value = isRaw(data) ? toCore(data) : data
            return callback(value)
        }
        this.store.update(update)
    }

    subscribe = (set: (value: any) => void) => {
        return this.store.subscribe((data: any) => {
            return set(isRaw(data) ? toCore(data) : data)
        })
    }
}

export const writable = (key: string, value: any) => {
    return new Writable(key, value)
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

// eslint-disable-next-line @typescript-eslint/no-empty-function
function noop() {}
