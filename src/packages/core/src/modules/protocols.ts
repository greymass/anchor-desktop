import {app, protocol} from 'electron'
import {log as logger} from '~/modules/log'
import {protocolHandlers} from '@types'
const log = logger.scope('handler')

export const enableProtocolHandlers = () => {
    protocolHandlers.forEach((uri: string) => {
        app.setAsDefaultProtocolClient(uri)
        protocol.registerHttpProtocol(uri, (req, cb) => {
            app.setAsDefaultProtocolClient(uri)
            log.info(`Registered HTTP Protocol: ${uri}`, req, cb)
        })
    })
}

export const disableProtocolHandlers = () => {
    protocolHandlers.forEach((uri: string) => {
        protocol.registerHttpProtocol(uri, (req, cb) => {
            app.removeAsDefaultProtocolClient(uri)
            log.info(`Remove Default HTTP Protocol: ${uri}`, req, cb)
        })
    })
}
