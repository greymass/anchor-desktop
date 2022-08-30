import type {Writable} from 'svelte/store'
import {Name} from '@greymass/eosio'

export * from '@stores/setup'
import {setupWritable} from '@stores/setup'

export const sharedName = setupWritable('sharedName', Name.from('foo'))
export const sharedNames: Writable<Name[]> = setupWritable('sharedNames', [
    Name.from('foo'),
    Name.from('bar'),
])
export const sharedInfo = setupWritable('sharedInfo')
