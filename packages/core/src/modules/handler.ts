import {app, protocol} from 'electron'
import {log as logger} from '~/modules/log'

const log = logger.scope('handler')

const uris = ['esr', 'esr-anchor', 'anchor', 'anchorcreate']

export const enableHandler = () => {
    uris.forEach((uri) => {
        app.setAsDefaultProtocolClient(uri)
        protocol.registerHttpProtocol(uri, (req, cb) => {
            log.info('Registered esr: protocol', req, cb)
        })
    })
}
