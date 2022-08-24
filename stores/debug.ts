import {Checksum256, PermissionLevel, PrivateKey} from '@greymass/eosio'
import {Writable} from 'svelte/store'
import {setupWritable} from '@stores'

export const currentChainId: Writable<Checksum256> = setupWritable(
    'currentChainId',
    Checksum256.from('2a02a0053e5a8cf73a56ba0fda11e4d92e0238a4a2aa74fccf46d5a910746840')
)

export const activeAuthority: Writable<PermissionLevel> = setupWritable(
    'activeAuthority',
    PermissionLevel.from({
        actor: 'corecorecore',
        permission: 'active',
    })
)

export const privateKey: PrivateKey = PrivateKey.from(
    '5JW71y3njNNVf9fiGaufq8Up5XiGk68jZ5tYhKpy69yyU9cr7n9'
)
