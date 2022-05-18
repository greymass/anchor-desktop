import electronLog from 'electron-log'

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
 * Export log for other modules to use
 */
export const log = electronLog
