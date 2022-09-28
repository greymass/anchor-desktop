export const events: Record<string, string> = {
    ANCHOR_READY: 'ANCHOR_READY',
    SIGN_DIGEST: 'SIGN_DIGEST',
    SIGN_TRANSACTION: 'SIGN_TRANSACTION',
    SIGNING_REQUEST_EXAMPLE: 'SIGNING_REQUEST_EXAMPLE',
    SIGNING_REQUEST_CANCELLED: 'SIGNING_REQUEST_CANCELLED',
    SIGNING_REQUEST_RECEIVED: 'SIGNING_REQUEST_RECEIVED',
    SESSION_ADD: 'SESSION_ADD',
    SESSION_REMOVE: 'SESSION_REMOVE',
    SESSION_CONFIG: 'SESSION_CONFIG',
}

export default events
