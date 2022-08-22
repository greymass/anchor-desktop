import {app, protocol} from 'electron'
import {log as logger} from '~/modules/log'

const log = logger.scope('handler')

const uris = ['esr', 'esr-anchor', 'anchor', 'anchorcreate']

export const enableHandler = () => {
    uris.forEach((uri) => {
        app.setAsDefaultProtocolClient(uri)
        protocol.registerHttpProtocol(uri, (req, cb) => {
            app.setAsDefaultProtocolClient(uri)
            log.info(`Registered HTTP Protocol: ${uri}`, req, cb)
        })
    })
}

export const disableHandler = () => {
    uris.forEach((uri) => {
        protocol.registerHttpProtocol(uri, (req, cb) => {
            app.removeAsDefaultProtocolClient(uri)
            log.info(`Remove Default HTTP Protocol: ${uri}`, req, cb)
        })
    })
}
