import {
    Name,
    Checksum256,
    PublicKey,
    Checksum256Type,
    NameType,
    PublicKeyType,
    Bytes,
    Struct,
    UInt32,
    UInt64,
} from '@wharfkit/antelope'
import {SigningRequest} from '@wharfkit/signing-request'
import zlib from 'pako'

@Struct.type('sealed_message')
export class SealedMessage extends Struct {
    @Struct.field('public_key') from!: PublicKey
    @Struct.field('uint64') nonce!: UInt64
    @Struct.field('bytes') ciphertext!: Bytes
    @Struct.field('uint32') checksum!: UInt32
}

@Struct.type('link_create')
export class LinkCreate extends Struct {
    @Struct.field('name') session_name!: Name
    @Struct.field('public_key') request_key!: PublicKey
    @Struct.field('string', {extension: true}) user_agent?: string
}

export interface ZlibProvider {
    deflateRaw: (data: Uint8Array) => Uint8Array
    inflateRaw: (data: Uint8Array) => Uint8Array
}

export interface IdentityRequestOptions {
    textEncoder?: TextEncoder
    textDecoder?: TextDecoder
    zlib?: ZlibProvider
}

export class BuoySession {
    public actor!: Name
    public permission!: Name
    public name!: Name
    public network!: Checksum256
    public publicKey!: PublicKey
    public created!: number
    public lastUsed!: number

    constructor(
        network: Checksum256Type,
        actor: NameType,
        permission: NameType,
        publicKey: PublicKeyType,
        name: NameType,
        created?: number,
        lastUsed?: number
    ) {
        this.network = Checksum256.from(network)
        this.actor = Name.from(actor)
        this.permission = Name.from(permission)
        this.publicKey = PublicKey.from(publicKey)
        this.name = Name.from(name)
        this.created = created || Date.now()
        this.lastUsed = lastUsed || Date.now()
    }

    updateLastUsed(time: number) {
        this.lastUsed = time
    }

    public static fromIdentityRequest(
        network: Checksum256Type,
        actor: NameType,
        permission: NameType,
        payload: string,
        options: IdentityRequestOptions = {}
    ) {
        const requestOptions = {
            textDecoder: options.textDecoder || new TextDecoder(),
            textEncoder: options.textEncoder || new TextEncoder(),
            zlib: options.zlib || zlib,
        }

        const request = SigningRequest.from(payload, requestOptions)
        if (!request.isIdentity()) {
            throw new Error('supplied request is not an identity request')
        }

        const linkInfo = request.getInfoKey('link', LinkCreate)
        if (!linkInfo || !linkInfo['request_key'] || !linkInfo['session_name']) {
            throw new Error('identity request does not contain link information')
        }

        return new BuoySession(
            String(network),
            actor,
            permission,
            String(linkInfo['request_key']),
            String(linkInfo['session_name'])
        )
    }

    // public static fromLoginResult(result: any): BuoySession {
    //     const linkInfo = result.resolved.request.getInfoKey('link', LinkCreate)
    //     if (!linkInfo || !linkInfo['request_key']) {
    //         throw new Error('identity request does not contain link information')
    //     }
    //     return new BuoySession(
    //         String(result.resolved.request.getChainId()),
    //         result.session.auth.actor,
    //         result.session.auth.permission,
    //         String(linkInfo['request_key']),
    //         result.session.identifier
    //     )
    // }
}
