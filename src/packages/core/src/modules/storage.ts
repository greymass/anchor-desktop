import {app, ipcMain, IpcMainInvokeEvent} from 'electron'
import Store from 'electron-store'
import crypto from 'crypto'

import events from '@types/events'
import {log as logger} from '~/modules/log'
import {validatePassword} from './signer'

const log = logger.scope('storage')

const migrations = {
    '0.0.1': (store: Store) => {
        store.set('deviceId', crypto.randomUUID())
        store.set('initialized', false)
    },
}

export class Storage {
    store: typeof Store
    constructor(options) {
        // If in development, specify a special path
        if (process.env.NODE_ENV === 'development') {
            options.cwd = `${app.getPath('appData')}/anchor-desktop-dev`
        }
        // Initialize the store
        this.store = new Store({
            beforeEachMigration: (store, context) => {
                log.info(`migrate from ${context.fromVersion} → ${context.toVersion}`)
            },
            migrations,
            ...options,
        })
        log.info('Started', options, this.store.size, this.store.path)
    }
    set = (key: string, value: unknown) => {
        logger.debug(key, value)
        this.store.set(key, value)
    }
    get = (key: string, defaultValue?: unknown) => {
        const data = this.store.get(key)
        return data ? data : defaultValue ? defaultValue : null
    }
    remove = (key: string) => {
        this.store.delete(key)
    }
    reset = () => this.store.clear()
}

export const storage = new Storage({})
ipcMain.handle(events.ANCHOR_FACTORY_RESET, (e: IpcMainInvokeEvent, password: string) => {
    if (validatePassword(password)) {
        storage.reset()
        app.exit()
    }
})

export function createStorage(options: Record<string, unknown> = {}) {
    const instance = new Storage(options)
    return instance
}
