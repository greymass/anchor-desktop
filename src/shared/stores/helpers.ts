/* eslint-disable @typescript-eslint/no-explicit-any */

import {ABISerializableConstructor, PermissionLevel, Serializer} from '@wharfkit/antelope'
import {CoreRawValue} from '@types'

export const isCore = (data: any) => data && data.constructor && data.constructor.abiName
export const isRaw = (data: any) => data && data.type && data.object

export const toCore = ({object, type}: CoreRawValue) => {
    const customTypes: ABISerializableConstructor[] = [PermissionLevel]
    return Serializer.decode({object, type, customTypes})
}

export const toRaw = (data: any) => ({
    object: Serializer.objectify(data),
    type: data.constructor.abiName,
})

export const encode = (value: any) => (isCore(value) ? toRaw(value) : value)
export const decode = (value: any) => (isRaw(value) ? toCore(value) : value)
