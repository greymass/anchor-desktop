<script lang="ts">
    import {PrivateKey, Serializer, type PublicKeyType} from '@greymass/eosio'
    import type {AnchorLinkSessionManagerSession} from '@greymass/anchor-link-session-manager'

    import logo from '@assets/anchor-logo-lightmode.svg'
    import {sessions} from '@stores/session'
    import {sharedNames} from '@stores'
    import {privateKey} from '@stores/debug'
    import {initialized, publicKeys, unlocked} from '@stores/signer'
    import {onMount} from 'svelte'
    import PasswordPrompt from '../../shared/components/prompt/password.svelte'
    import ElevatePrompt from '../../shared/components/prompt/elevate.svelte'

    let password: string | undefined = undefined

    function test() {
        window.anchor.exampleRequest()
    }

    function removeSession(session: AnchorLinkSessionManagerSession) {
        window.anchor.sessions.remove(Serializer.objectify(session))
    }

    const lighthouseURL = 'https://eosio.greymass.com'
    function lookup(publicKey: string): Promise<Array<string>> {
        return fetch(`${lighthouseURL}/lookup/${publicKey}?includeTestnets`)
            .then((res) => {
                return res.json()
            })
            .then((json) => {
                return json
            })
            .catch((error) => {
                throw error
            })
    }

    let key: string | undefined = String(privateKey)
    let lookupResponse = []
    async function importPrivateKey(e: Event) {
        e.preventDefault()
        if (key) {
            window.anchor.signer.importKey(key)
            // const publicKey = PrivateKey.from(key).toPublic()
            // console.log('imported', String(publicKey))
            // lookupResponse = await lookup(String(publicKey))
        }
    }

    function removeKey(pubkey: PublicKeyType) {
        window.anchor.signer.removeKey(pubkey, password)
    }

    function addAccount(network, account) {
        console.log(network, account)
    }

    async function validatePassword(event: Event) {
        console.log('validatePassword', password)
        const validated = await window.anchor.signer.unlock(password)
        console.log('validated', validated)
        event.preventDefault()
        password = undefined
    }

    async function setPassword(event: Event) {
        console.log('setPassword', password)
        window.anchor.signer.setPassword(password)
        event.preventDefault()
        password = undefined
    }

    function lock() {
        window.anchor.signer.lock()
        password = undefined
    }

    function reset(e: CustomEvent<string>) {
        window.anchor.wipe(e.detail)
    }
</script>

<style>
    :root {
        font-family: -apple-system, Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
            sans-serif;
    }

    main {
        text-align: center;
        padding: 2em;
        margin: 0 auto;
    }

    table,
    table * {
        border: 1px solid black;
        text-align: left;
        width: 100%;
    }
    table td,
    th {
        padding: 0.25em 1em;
    }
</style>

{#if $initialized}
    {#if $unlocked}
        <main>
            <h2>Initiate a signing request</h2>
            <p>Or trigger an example request:</p>
            <button on:click={test}>Prompt Request</button>
            <button on:click={lock}>Lock Wallet</button>
            <ElevatePrompt on:elevated={reset}>
                <button>Reset</button>
            </ElevatePrompt>
            <hr />
            <form on:submit={importPrivateKey}>
                <input autoFocus type="text" name="privateKey" bind:value={key} />
                <button on:click={importPrivateKey}>Import Key</button>
            </form>
            {#if lookupResponse.length}
                <table>
                    <thead>
                        <tr>
                            <th>Network</th>
                            <th>Account</th>
                            <th>Controls</th>
                        </tr>
                    </thead>
                    {#each lookupResponse as network}
                        {#each network.accounts as account}
                            <tr>
                                <td>{network.network}</td>
                                <td>{account.actor}@{account.permission}</td>
                                <td>
                                    <button on:click={() => addAccount(network, account)}
                                        >Add</button
                                    >
                                </td>
                            </tr>
                        {/each}
                    {:else}
                        <tr>
                            <td colspan="3">No active sessions.</td>
                        </tr>
                    {/each}
                </table>
            {/if}
            <hr />
            {#if $sessions}
                <table>
                    <thead>
                        <tr>
                            <th>Account</th>
                            <th>Application</th>
                            <th>Controls</th>
                        </tr>
                    </thead>
                    {#each $sessions as session}
                        <tr>
                            <td>{session.actor}@{session.permission}</td>
                            <td>{session.name}</td>
                            <td>
                                <button on:click={() => removeSession(session)}>Remove</button>
                            </td>
                        </tr>
                    {:else}
                        <tr>
                            <td colspan="3">No active sessions.</td>
                        </tr>
                    {/each}
                </table>
            {/if}
            <hr />
            {#if $publicKeys}
                <table>
                    <thead>
                        <tr>
                            <th>Public key</th>
                        </tr>
                    </thead>
                    {#each $publicKeys as key}
                        <tr>
                            <td>{key}</td>
                            <td>
                                <ElevatePrompt on:elevated={() => removeKey(key)}>
                                    <button>Remove</button>
                                </ElevatePrompt>
                            </td>
                        </tr>
                    {:else}
                        <tr>
                            <td colspan="3">No keys available.</td>
                        </tr>
                    {/each}
                </table>
            {/if}
        </main>
    {:else}
        <p>Enter password to unlock</p>
        <PasswordPrompt bind:password on:submit={validatePassword} />
    {/if}
{:else}
    <p>Setup a new password</p>
    <PasswordPrompt validate={false} bind:password on:submit={setPassword} />
{/if}
