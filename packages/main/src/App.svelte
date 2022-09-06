<script lang="ts">
    import {Serializer, type PublicKeyType} from '@greymass/eosio'
    import type {AnchorLinkSessionManagerSession} from '@greymass/anchor-link-session-manager'

    import logo from '@assets/anchor-logo-lightmode.svg'
    import {sessions} from '@stores/session'
    import {sharedNames} from '@stores'
    import {privateKey} from '@stores/debug'
    import {publicKeys} from '@stores/signer'
    import {onMount} from 'svelte'

    function test() {
        window.anchor.exampleRequest()
    }

    function removeSession(session: AnchorLinkSessionManagerSession) {
        window.anchor.sessions.remove(Serializer.objectify(session))
    }

    let key: string | undefined = String(privateKey)
    function importPrivateKey(e) {
        e.preventDefault()
        window.anchor.signer.importPrivateKey(key)
    }

    function removeKey(key: PublicKeyType) {
        console.log(key)
        window.anchor.signer.removePublicKey(key)
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

    img {
        height: 16rem;
        width: 16rem;
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

<main>
    <img src={logo} alt="Anchor Logo" />
    <h2>Initiate a signing request</h2>
    <p>Or trigger an example request:</p>
    <button on:click={test}>Prompt Request</button>
    <hr />
    <form on:submit={importPrivateKey}>
        <input autoFocus type="text" name="privateKey" bind:value={key} />
        <button on:click={importPrivateKey}>Import Key</button>
    </form>
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
                        <button on:click={() => removeKey(key)}>Remove</button>
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
