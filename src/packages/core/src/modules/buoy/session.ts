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
    TimePointSec,
    TimePointType,
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

export type BuoySessionType =
    | BuoySession
    | {
          network: Checksum256Type
          actor: NameType
          permission: NameType
          publicKey: PublicKeyType
          name: NameType
          created: TimePointType
          lastUsed: TimePointType
      }

@Struct.type('buoy_session')
export class BuoySession extends Struct {
    @Struct.field(Name) actor!: Name
    @Struct.field(Name) permission!: Name
    @Struct.field(Name) name!: Name
    @Struct.field(Checksum256) network!: Checksum256
    @Struct.field(PublicKey) publicKey!: PublicKey
    @Struct.field(TimePointSec) created!: TimePointSec
    @Struct.field(TimePointSec) lastUsed!: TimePointSec

    static from(session: BuoySessionType): BuoySession {
        return new this({
            network: Checksum256.from(session.network),
            actor: Name.from(session.actor),
            permission: Name.from(session.permission),
            publicKey: PublicKey.from(session.publicKey),
            name: Name.from(session.name),
            created: session.created,
            lastUsed: session.lastUsed,
        }) as BuoySession
    }

    updateLastUsed(time: TimePointSec) {
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

        return super.from({
            network,
            actor,
            permission,
            publicKey: String(linkInfo['request_key']),
            name: String(linkInfo['session_name']),
            created: TimePointSec.fromDate(new Date()),
            lastUsed: TimePointSec.fromDate(new Date()),
        }) as BuoySession
    }

    equals(other: BuoySessionType) {
        const otherSession = BuoySession.from(other)
        return (
            this.network.equals(otherSession.network) &&
            this.actor.equals(otherSession.actor) &&
            this.permission.equals(otherSession.permission) &&
            this.name.equals(otherSession.name)
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
