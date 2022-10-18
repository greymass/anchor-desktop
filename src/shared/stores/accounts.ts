import {Readable} from 'svelte/store'
import {setupDerived, setupWritable} from './setup'
import {Account} from '../types'

export const accounts: Readable<Account[]> = setupWritable('accounts', [])
