import {
    Checksum256Type,
    NameType,
    PermissionLevel,
    PermissionLevelType,
    PrivateKeyType,
    PublicKey,
    PublicKeyType,
} from '@wharfkit/antelope'

export interface CoreRawValue {
    object: any
    type: string
}

export interface IdentityRequestParams {
    network: Checksum256Type
    actor: NameType
    permission: NameType
    payload: string
}

export interface SessionParams {
    network: Checksum256Type
    actor: NameType
    permission: NameType
    publicKey: PublicKeyType
    name: string
}

export interface KeyStore {
    hardwareKeys: Record<string, string>
    publicKeys: PublicKeyType[]
    privateKeys: PrivateKeyType[] | string
}

export interface Account {
    chainId: Checksum256Type
    name: NameType
    permission: PermissionLevel
    publicKey: PublicKey
}

export interface AccountStore {
    accounts: Account[]
}

export interface LighthouseResponse {
    accounts: PermissionLevelType[]
    chainId: Checksum256Type
    network: string
}

export const esrParams = ['bn', 'ex', 'rbn', 'req', 'rid', 'sa', 'sig', 'sp', 'tx']

export const protocolHandlers = ['esr', 'esr-anchor', 'anchor']
// export const creationProtocols = ['anchorcreate']
