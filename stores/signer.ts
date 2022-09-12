import {Checksum256, Name, PermissionLevel, PublicKeyType} from '@greymass/eosio'
import {Readable} from 'svelte/store'
import {setupDerived, setupWritable} from '@stores/setup'

export const initialized: Readable<boolean> = setupWritable('initialized', false)
export const unlocked: Readable<boolean> = setupWritable('unlocked', false)

export const publicKeys: Readable<PublicKeyType[]> = setupWritable('publicKeys', [])

export const chainId: Readable<Checksum256 | undefined> = setupWritable('chainId', undefined)
export const account: Readable<Name | undefined> = setupWritable('account', undefined)
export const permission: Readable<Name | undefined> = setupWritable('permission', undefined)
export const authority = setupDerived(
    'authority',
    [account, permission],
    ([$account, $permission]) => {
        if ($account && $permission) {
            return PermissionLevel.from(`${$account}@${$permission}`)
        }
        return undefined
    }
)
