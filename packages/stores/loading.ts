import {writable} from 'svelte/store'
import type {Writable} from 'svelte/store'

export const isLoading: Writable<boolean> = writable(true)
