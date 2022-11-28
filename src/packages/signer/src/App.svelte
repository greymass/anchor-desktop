<script lang="ts">
    import {APIClient, Name, Signature, SignedTransaction, Transaction} from '@greymass/eosio'
    import type {ResolvedCallback} from 'eosio-signing-request'

    import type {IdentityRequestParams} from '@types'
    import {esrParams} from '@types'
    import {activeRequest} from '@stores/request'
    import {account, permission} from '@stores/signer'
    import RicardianContract from '~/components/RicardianContract.svelte'

    import {
        abis,
        currentRequest,
        currentSigningDigest,
        currentTransaction,
        resolvedRequest,
        resolvedTransaction,
    } from './request'

    let signature: Signature | undefined = undefined
    let transaction_id: string | undefined = undefined

    async function sign() {
        // Set current account/permission stores
        account.set(Name.from('corecorecore'))
        permission.set(Name.from('active'))
        if ($currentSigningDigest) {
            signature = await window.anchor.signer.signDigest($currentSigningDigest)
            if ($currentTransaction && signature) {
                const signedTransaction = SignedTransaction.from({
                    ...$currentTransaction,
                    signatures: [signature],
                })
                if (signature && $currentRequest && $resolvedRequest) {
                    const callbackParams: ResolvedCallback | null = $resolvedRequest.getCallback(
                        signedTransaction.signatures,
                        0
                    )
                    if ($currentRequest.isIdentity()) {
                        // Perform identity request
                        const {info} = $resolvedRequest.request.data
                        const isLinkSession = info.some((i: any) => i.key === 'link')
                        if (isLinkSession && callbackParams) {
                            const config = await window.anchor.sessions.config()
                            console.log(config)
                            callbackParams.payload = {
                                ...callbackParams.payload,
                                link_ch: `https://${config.linkUrl}/${config.linkId}`,
                                link_key: config.requestKey,
                                link_name: 'Anchor Desktop',
                            }
                            console.log(callbackParams)
                            const session: IdentityRequestParams = {
                                network:
                                    '2a02a0053e5a8cf73a56ba0fda11e4d92e0238a4a2aa74fccf46d5a910746840',
                                actor: callbackParams.payload.sa,
                                permission: callbackParams.payload.sp,
                                payload: String($resolvedRequest.request),
                            }
                            console.log(session)
                            console.log(window.anchor)
                            window.anchor.sessions.add(session)

                            // Perform the callback

                            const {payload, url} = callbackParams
                            console.log(url, payload)
                            let s = url
                            esrParams.forEach((param: any) => {
                                s = s.replace(`{{${param}}}`, payload[param])
                            })
                            const test = await fetch(s, {
                                method: 'POST',
                                body: JSON.stringify(payload),
                            })
                            console.log(test)
                            // const {httpClient} = await createHttpHandler(connection)
                            // httpClient
                            //     .post(s, payload)
                            //     .then(() =>
                            //         dispatch({
                            //             type: types.SYSTEM_ESRURICALLBACK_SUCCESS,
                            //             payload: {
                            //                 background,
                            //                 payload,
                            //                 s,
                            //             },
                            //         })
                            //     )
                            //     .catch((err) =>
                            //         dispatch({
                            //             type: types.SYSTEM_ESRURICALLBACK_FAILURE,
                            //             payload: {
                            //                 err,
                            //                 payload,
                            //                 s,
                            //             },
                            //         })
                            //     )
                        }
                    } else {
                        // Perform regular transaction directly
                        const shouldBroadcast = $resolvedRequest.request.shouldBroadcast()
                        if (shouldBroadcast) {
                            const cosignerSig = $resolvedRequest.request.getInfoKey('cosig', {
                                type: Signature,
                                array: true,
                            })
                            if (cosignerSig) {
                                signedTransaction.signatures.unshift(...cosignerSig)
                            }
                            const jungle = new APIClient({url: 'https://jungle3.greymass.com'})
                            const result = await jungle.v1.chain.push_transaction(signedTransaction)
                            transaction_id = result.transaction_id
                        }
                        if (callbackParams) {
                            const {payload, url} = callbackParams
                            console.log(url, payload)
                            let s = url
                            esrParams.forEach((param: any) => {
                                s = s.replace(`{{${param}}}`, payload[param])
                            })
                            const test = await fetch(s, {
                                method: 'POST',
                                body: JSON.stringify(payload),
                            })
                            console.log(test)
                        }

                        // let callbackParams
                        // if ((callback && broadcast) || (callback && !callback.broadcast)) {
                        //     const blockNum = broadcasted ? broadcasted.processed.block_num : null
                        //     callbackParams =
                        //         prompt.resolved.getCallback &&
                        //         prompt.resolved.getCallback(signed.transaction.signatures, blockNum)
                        //     callbackParams && dispatch(callbackURIWithProcessed(callbackParams))
                        // }
                    }
                }
            }
        }
    }

    function close() {
        window.anchor.cancelRequest()
    }
</script>

<style>
    :root {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
            Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }

    main {
        text-align: center;
        padding: 1em;
        margin: 0 auto;
    }

    h1 {
        color: #ff3e00;
        text-transform: uppercase;
        font-size: 4rem;
        font-weight: 100;
        line-height: 1.1;
        margin: 2rem auto;
    }

    pre {
        text-align: left;
    }
</style>

<main>
    <h2>Sign with {$account}</h2>
    <button on:click={() => sign()}> Sign </button>
    <button on:click={() => close()}> Close </button>
    {#if $abis && $currentTransaction?.actions}
        {#each $currentTransaction?.actions as action}
            <RicardianContract
                {action}
                abi={$abis.get(String(action.account))}
                transaction={$currentTransaction}
            />
        {/each}
    {/if}
    <p>Payload: {$activeRequest}</p>
    <p>Signature: {JSON.stringify(signature || 'Not signed')}</p>
    <p>transaction_id: {transaction_id}</p>
    <p>Resolved:</p>
    <pre>{JSON.stringify($resolvedTransaction, null, '\t')}</pre>
</main>
