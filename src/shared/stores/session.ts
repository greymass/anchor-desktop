import {Readable} from 'svelte/store'
import {AnchorLinkSessionManagerSession} from '@greymass/anchor-link-session-manager'

import {setupWritable} from '@stores/setup'

export const sessions: Readable<AnchorLinkSessionManagerSession> = setupWritable('sessions')
