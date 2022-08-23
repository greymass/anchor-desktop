import {derived, writable} from 'svelte/store'
import type {Readable, Writable} from 'svelte/store'
import {handlerProtocols} from '@types'

import {Transaction, type ABIDef, type Checksum256} from '@greymass/eosio'
import type {AbiMap, ResolvedTransaction} from 'eosio-signing-request'

import {APIClient, PermissionLevel, TransactionHeader} from '@greymass/eosio'
import {SigningRequest} from 'eosio-signing-request'

// import {ChainConfig, chainConfig} from '~/config'
import {activeAuthority, currentChainId} from '@stores/debug'
import {activeRequest} from '@stores/request'

import zlib from 'pako'

// The API client to fulfill the request
export const apiClient: Readable<APIClient | undefined> = derived(
    activeRequest,
    ($activeRequest) => {
        // if ($currentChain) {
        return new APIClient({url: 'https://jungle3.greymass.com'})
        // }
    }
)

// The ABI Provider derived from the API Client to resolve requests
export const abiProvider: Readable<any> = derived(apiClient, ($apiClient) => {
    if ($apiClient) {
        return {
            getAbi: async (account: string) => {
                return (await $apiClient.v1.chain.get_abi(account)).abi as ABIDef
            },
        }
    }
})

// The currently loaded request, derived from the current route
export const currentRequest: Readable<SigningRequest | undefined> = derived(
    activeRequest,
    ($activeRequest) => {
        if ($activeRequest) {
            const handlers = handlerProtocols.map((s: string) => `${s}:`).join('|')
            const regex = new RegExp(`(${handlers})`, 'gim')
            const payload = $activeRequest.replace(regex, 'esr:')
            const request = SigningRequest.from(payload, {zlib})
            return request
        }
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
    }
)

export const abiDefs = derived([abis], ([$abis]) => {
    if ($abis) {
        // { contract: NameType; abi: ABIDef; }[]
        const abiDefs: any = []
        $abis.forEach((value, key) => {
            abiDefs.push({
                contract: key,
                abi: value,
            })
        })

        console.log(abiDefs)
        return abiDefs
    }
})

// Whether or not this is a multichain request
export const multichain: Readable<boolean> = derived(currentRequest, ($currentRequest) => {
    if ($currentRequest) {
        return $currentRequest.isMultiChain()
    }
    return false
})

// The current transaction resolved from the current request
export const currentTransaction: Readable<Transaction> = derived(
    [abis, abiDefs, activeAuthority, apiClient, currentRequest],
    ([$abis, $abiDefs, $activeAuthority, $apiClient, $currentRequest], set) => {
        if ($abis && $abiDefs && $apiClient && $currentRequest) {
            // If an active session exists, use it instead
            // if ($activeSession) {
            //     auth = $activeSession.auth
            // }
            // Resolve the transaction for the interface to display
            $apiClient.v1.chain.get_info().then((info: any) => {
                const header: TransactionHeader = info.getTransactionHeader()
                const resolved = $currentRequest.resolveTransaction($abis, $activeAuthority, header)
                set(Transaction.from(resolved, $abiDefs))
            })
        }
        return undefined
    }
)

export const currentSigningDigest: Readable<Checksum256 | undefined> = derived(
    [currentTransaction],
    ([$currentTransaction]) => {
        if ($currentTransaction) {
            return $currentTransaction.signingDigest(currentChainId)
        }
        return undefined
    }
)
