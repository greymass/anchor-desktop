import {Checksum256, PermissionLevel, PrivateKey} from '@wharfkit/antelope'
import {Writable} from 'svelte/store'
import {setupWritable} from '@stores/setup'

export const currentChainId: Writable<Checksum256> = setupWritable(
    'currentChainId',
    Checksum256.from('73e4385a2708e6d7048834fbc1079f2fabb17b3c125b146af438971e90716c4d')
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

export const debugPassword = 'password'
