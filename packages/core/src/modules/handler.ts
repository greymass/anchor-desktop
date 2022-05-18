import {app, protocol} from 'electron'
import {log as logger} from '~/modules/log'

const log = logger.scope('handler')

export const enableHandler = () => {
    // Setup generic esr:// handlers
    app.setAsDefaultProtocolClient('esr')
    protocol.registerHttpProtocol('esr', (req, cb) => {
        log.info('Registered esr: protocol', req, cb)
    })
    // Setup Anchor specific anchor:// handlers
    app.setAsDefaultProtocolClient('anchor')
    protocol.registerHttpProtocol('anchor', (req, cb) => {
        log.info('Registered anchor: protocol', req, cb)
    })
    // Setup account creation via Anchor specific anchorcreate:// handlers
    app.setAsDefaultProtocolClient('anchorcreate')
    protocol.registerHttpProtocol('anchorcreate', (req, cb) => {
        log.info('Registered anchorcreate: protocol', req, cb)
    })
}
