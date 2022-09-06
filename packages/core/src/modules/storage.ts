import Store from 'electron-store'

import {log as logger} from '~/modules/log'
const log = logger.scope('storage')

class Storage {
    store: typeof Store
    constructor() {
        this.store = new Store()
        log.info('Started', this.store.size, this.store.path)
    }
    set = (key: string, value: any) => this.store.set(key, value)
    get = (key: string, defaultValue?: any) => {
        const data = this.store.get(key)
        return data ? data : defaultValue ? defaultValue : null
    }
}

export const storage = new Storage()
