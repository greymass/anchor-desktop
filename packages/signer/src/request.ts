import {derived} from 'svelte/store'
import type {Readable} from 'svelte/store'
import {protocolHandlers} from '@types'

import {
    ABI,
    API,
    Checksum256,
    Serializer,
    Transaction,
    type ABIDef,
    type NameType,
} from '@greymass/eosio'
import type {AbiMap, AbiProvider, ResolvedTransaction} from 'eosio-signing-request'

import {APIClient, TransactionHeader} from '@greymass/eosio'
import {IdentityV2, IdentityV3, SigningRequest, ResolvedSigningRequest} from 'eosio-signing-request'

// import {ChainConfig, chainConfig} from '~/config'
import {activeAuthority, currentChainId} from '@stores/debug'
import {activeRequest} from '@stores/request'

import zlib from 'pako'

// The current request, derived from the request from the main process
export const currentRequest: Readable<SigningRequest | undefined> = derived(
    activeRequest,
    ($activeRequest) => {
        if ($activeRequest) {
            // Convert all registered protocols with esr:
            const handlers = protocolHandlers.map((s: string) => `${s}:`).join('|')
            const regex = new RegExp(`(${handlers})`, 'gim')
            const payload = $activeRequest.replace(regex, 'esr:')
            const request = SigningRequest.from(payload, {zlib})
            return request
        }
        return undefined
    }
)

// Boolean to indicate whether or not the request is an identity request
export const isIdentityRequest: Readable<boolean> = derived(currentRequest, ($currentRequest) => {
    if ($currentRequest) {
        return $currentRequest.isIdentity()
    }
    return false
})

// Boolean to indicate whether this is a multi-chain request
export const isMultiChain: Readable<boolean> = derived(currentRequest, ($currentRequest) => {
    if ($currentRequest) {
        return $currentRequest.isMultiChain()
    }
    return false
})

// The API client used with the request
export const apiClient: Readable<APIClient | undefined> = derived(
    [currentRequest, isIdentityRequest, isMultiChain],
    ([$currentRequest, $isIdentityRequest, $isMultiChain]) => {
        if ($currentRequest) {
            // if ($isIdentityRequest) {
            //     console.log('identity request')
            // } else if ($isMultiChain) {
            //     console.log('chainIds for multichain request', $currentRequest.getChainIds())
            // } else {
            //     console.log('chainId for request', $currentRequest.getChainId())
            // }
            // CHANGE: Use the proper blockchain based on the chainId
            return new APIClient({url: 'https://jungle3.greymass.com'})
        }
    }
)

// The ABI Provider derived from the API Client to resolve requests
export const abiProvider: Readable<AbiProvider | undefined> = derived(
    apiClient,
    ($apiClient): AbiProvider | undefined => {
        if ($apiClient) {
            return {
                getAbi: async (account: NameType): Promise<ABIDef> => {
                    return (await $apiClient.v1.chain.get_abi(account)).abi as ABIDef
                },
            }
        }
        return undefined
    }
)

// Set the current chain based on the current request
// currentRequest.subscribe((request) => {
//     if (request) {
//         const id = request.getChainId()
//         if (!currentChainConfig || !currentChainConfig.chainId.equals(id)) {
//             currentChain.set(chainConfig(id))
//         }
//     }
// })

// The ABIs required for the current request
export const abis: Readable<AbiMap | undefined> = derived(
    [abiProvider, currentRequest],
    ([$abiProvider, $currentRequest], set) => {
        if ($currentRequest) {
            $currentRequest.fetchAbis($abiProvider).then((abis) => set(abis))
        }
        return undefined
    }
)

export interface abiDefsType {
    contract: NameType
    abi: ABIDef
}

// The ABIDefs for the current request
export const abiDefs: Readable<abiDefsType[]> = derived([abis], ([$abis]) => {
    const abiDefs: abiDefsType[] = []
    if ($abis) {
        $abis.forEach((value, key) => {
            abiDefs.push({
                contract: key,
                abi: value,
            })
        })
    }
    return abiDefs
})

// The Identity Request ABI (not easily accessible from eosio-signing-request)
export const identityAbi: Readable<ABI | undefined> = derived(currentRequest, ($currentRequest) => {
    if ($currentRequest) {
        const version = $currentRequest.version === 2 ? IdentityV2 : IdentityV3
        const abi = Serializer.synthesize(version)
        abi.actions = [{name: 'identity', type: 'identity', ricardian_contract: ''}]
        return abi
    }
    return undefined
})

// The resolved transaction from the current request
export const resolvedRequest: Readable<ResolvedSigningRequest | undefined> = derived(
    [abis, activeAuthority, apiClient, currentRequest],
    ([$abis, $activeAuthority, $apiClient, $currentRequest], set) => {
        if ($abis && $activeAuthority && $apiClient && $currentRequest) {
            // If an active session exists, use it instead
            // if ($activeSession) {
            //     auth = $activeSession.auth
            // }
            // Resolve the transaction for the interface to display
            $apiClient.v1.chain.get_info().then((info: API.v1.GetInfoResponse) => {
                const header: TransactionHeader = info.getTransactionHeader()
                const resolved = $currentRequest.resolve($abis, $activeAuthority, {
                    ...header,
                    chainId: Checksum256.from(
                        '2a02a0053e5a8cf73a56ba0fda11e4d92e0238a4a2aa74fccf46d5a910746840'
                    ),
                })
                set(resolved)
            })
        }
        return undefined
    }
)

// The resolved transaction from the resolved request
export const resolvedTransaction: Readable<ResolvedTransaction | undefined> = derived(
    [resolvedRequest],
    ([$resolvedRequest]) => {
        if ($resolvedRequest) {
            return $resolvedRequest.resolvedTransaction
        }
        return undefined
    }
)

// The current transaction from the resolved request
export const currentTransaction: Readable<Transaction | undefined> = derived(
    [abiDefs, currentRequest, identityAbi, resolvedRequest],
    ([$abiDefs, $currentRequest, $identityAbi, $resolvedRequest], set) => {
        if ($abiDefs && $currentRequest && $identityAbi && $resolvedRequest) {
            if ($resolvedRequest.request.isIdentity()) {
                set(Transaction.from($resolvedRequest.resolvedTransaction, $identityAbi))
            } else {
                set(Transaction.from($resolvedRequest.resolvedTransaction, $abiDefs))
            }
        }
        return undefined
    }
)

export const currentSigningDigest: Readable<Checksum256 | undefined> = derived(
    [currentChainId, currentTransaction],
    ([$currentChainId, $currentTransaction]) => {
        if ($currentTransaction) {
            return $currentTransaction.signingDigest($currentChainId)
        }
        return undefined
    }
)
