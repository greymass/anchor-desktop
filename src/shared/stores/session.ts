import {Readable} from 'svelte/store'

import {setupWritable} from '@stores/setup'

export const sessions = setupWritable('sessions')
