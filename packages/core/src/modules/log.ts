import {app} from 'electron'

import electronLog from 'electron-log'
import path from 'path'

/**
 * Bind all console.log to electron-log
 */
const cl = console.log.bind(console)
console.log = (...args) => {
    const logger = electronLog.scope('console')
    logger.info(args)
    cl(...args)
}

/**
 * Set dedicated log for development mode
 */
if (process.env.NODE_ENV === 'development') {
    electronLog.transports.file.resolvePath = () =>
        `${app.getPath('appData')}/anchor-desktop-dev/main.log`
}

/**
 * Export log for other modules to use
 */
export const log = electronLog
