export const events: Record<string, string> = {
    SESSION_ADD: 'SESSION_ADD',
    SESSION_CONFIG: 'SESSION_CONFIG',
    SESSION_REMOVE: 'SESSION_REMOVE',
    SIGNER_IMPORT_PRIVATE_KEY: 'SIGNER_IMPORT_PRIVATE_KEY',
    SIGNER_LIST_KEYS: 'SIGNER_LIST_KEYS',
    SIGNER_REMOVE_PUBLIC_KEY: 'SIGNER_REMOVE_PUBLIC_KEY',
    SIGNER_SIGN_DIGEST: 'SIGNER_SIGN_DIGEST',
    SIGNER_SIGN_TRANSACTION: 'SIGNER_SIGN_TRANSACTION',
    SIGNING_REQUEST_CANCELLED: 'SIGNING_REQUEST_CANCELLED',
    SIGNING_REQUEST_EXAMPLE: 'SIGNING_REQUEST_EXAMPLE',
    SIGNING_REQUEST_RECEIVED: 'SIGNING_REQUEST_RECEIVED',
}

export default events
