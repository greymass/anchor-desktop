import {app, protocol} from 'electron'
import {log} from '~/modules/log'

export const enableHandler = () => {
    log.info('modules/handler: enable')
    // Setup generic esr:// handlers
    app.setAsDefaultProtocolClient('esr')
    protocol.registerHttpProtocol('esr', (req, cb) => {
        log.info('modules/handler: register', req, cb)
    })
    // Setup Anchor specific anchor:// handlers
    app.setAsDefaultProtocolClient('anchor')
    protocol.registerHttpProtocol('anchor', (req, cb) => {
        log.info('modules/handler: register', req, cb)
    })
    // Setup account creation via Anchor specific anchorcreate:// handlers
    app.setAsDefaultProtocolClient('anchorcreate')
    protocol.registerHttpProtocol('anchorcreate', (req, cb) => {
        log.info('modules/handler: register', req, cb)
    })
}
