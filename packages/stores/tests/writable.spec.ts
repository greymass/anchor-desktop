import {describe, expect, test} from 'vitest'

import {Asset, Name} from '@greymass/eosio'
import {get} from 'svelte/store'
import {writable} from '../types/writable'
// import {writable} from 'svelte/store'

describe('@greymass/eosio compatible store - writable', () => {
    test('get: reverse compatible syntax', async () => {
        const store = writable('bar')
        const storeValue = get(store)
        expect(storeValue).toEqual('bar')
    })
    test('get: non-core value', async () => {
        const store = writable('bar', 'foo')
        const storeValue = get(store)
        expect(storeValue).toEqual('bar')
    })
    test('get: core type', async () => {
        const value = Name.from('bar')
        const store = writable(value, 'foo')
        const storeValue = get(store)
        expect(storeValue).toBeInstanceOf(Name)
        expect(storeValue).toEqual(value)
    })
    test('set', async () => {
        const name1 = Name.from('bar')
        const store = writable(name1, 'foo')

        const storeValueBefore = get(store)
        expect(storeValueBefore).toBeInstanceOf(Name)
        expect(storeValueBefore).toEqual(name1)

        const name2 = Name.from('baz')
        store.set(name2)

        const storeValueAfter = get(store)
        expect(storeValueAfter).toBeInstanceOf(Name)
        expect(storeValueAfter).toEqual(name2)
    })
    test('update', async () => {
        // Set initial value
        const balance = Asset.from('0.0001 EOS')
        const store = writable(balance, 'balance')

        // Ensure the value is an Asset and the value is 0.0001
        const storeValueBefore = get(store)
        expect(storeValueBefore).toBeInstanceOf(Asset)
        expect(String(storeValueBefore)).toEqual('0.0001 EOS')
        expect(storeValueBefore.value).toEqual(0.0001)

        // Increment the value of the asset by 0.0001
        store.update((n) => {
            n.value += 0.0001
            return n
        })

        // Ensure the value is an Asset and the value is 0.0002
        const storeValueAfter = get(store)
        expect(storeValueAfter).toBeInstanceOf(Asset)
        expect(String(storeValueAfter)).toEqual('0.0002 EOS')
        expect(storeValueAfter.value).toEqual(0.0002)
    })
})
