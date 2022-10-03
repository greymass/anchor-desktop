import {ipcRenderer} from 'electron'

import type {Account} from '@types'
import events from '@types/events'

export const accounts = {
    add: (account: Account) => ipcRenderer.invoke(events.ACCOUNTS_IMPORT, account),
    remove: (account: Account) => ipcRenderer.invoke(events.ACCOUNTS_REMOVE, account),
}
