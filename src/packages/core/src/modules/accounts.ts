import {ipcMain, IpcMainInvokeEvent} from 'electron'

import {accounts} from '@stores/accounts'
import type {Account, AccountStore} from '@types'
import events from '@types/events'

import {log as logger} from '~/modules/log'
import {storage} from '~/modules/storage'

const log = logger.scope('accounts')

const defaultAccountStore: AccountStore = {
    accounts: [],
}

export function getAccounts(): Account[] {
    const store = storage.get('accountstore', defaultAccountStore)
    return store ? store.accounts : []
}

function handleAccountImport(event: IpcMainInvokeEvent, account: Account) {
    log.debug('handleAccountImport', account)
    // Load the keystores
    const store = storage.get('accountstore', defaultAccountStore)
    // Check if the record already exists
    const existing = store.accounts.find(
        (a: Account) =>
            a.chainId === account.chainId &&
            a.name === account.name &&
            a.permission === account.permission &&
            a.publicKey === account.publicKey
    )
    if (!existing) {
        store.accounts.push(account)
    }
    // Update svelte store
    accounts.set(store.accounts)
    // Save the store
    storage.set('accountstore', store)
}

function handleAccountRemove(event: IpcMainInvokeEvent, account: Account) {
    log.debug('handleAccountRemove', account)
    // Load the keystores
    const store = storage.get('accountstore', defaultAccountStore)
    // Remove the matching account
    const index = store.accounts.findIndex(
        (a: Account) =>
            a.chainId === account.chainId &&
            a.name === account.name &&
            a.permission === account.permission &&
            a.publicKey === account.publicKey
    )
    if (index >= 0) {
        store.accounts.splice(index, 1)
    }
    // Update svelte store
    accounts.set(store.accounts)
    // Save the store
    storage.set('accountstore', store)
}

export const enableAccounts = () => {
    log.debug('Registering Account events')
    ipcMain.handle(events.ACCOUNTS_IMPORT, handleAccountImport)
    ipcMain.handle(events.ACCOUNTS_REMOVE, handleAccountRemove)
    // log.debug('Loading data into stores')
    accounts.set(getAccounts())
}
