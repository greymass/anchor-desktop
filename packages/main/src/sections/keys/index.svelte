<script lang="ts">
    import {PublicKey, type PublicKeyType} from '@greymass/eosio'

    import {accounts} from '@stores/accounts'
    import {privateKey} from '@stores/debug'
    import {publicKeys} from '@stores/signer'

    import ElevatePrompt from '@packages/shared/components/prompt/elevate.svelte'

    let key: string | undefined = String(privateKey)
    let legacy: boolean = false

    async function importPrivateKey(e: Event) {
        e.preventDefault()
        if (key) {
            window.anchor.signer.importKey(key)
        }
    }

    function toggleLegacy(event: HTMLInputFormEvent) {
        legacy = event.currentTarget.checked
    }

    function removeKey(pubkey: PublicKeyType) {
        window.anchor.signer.removeKey(pubkey)
    }
</script>

<style>
    table,
    table * {
        border: 1px solid black;
        text-align: left;
    }
    table td,
    th {
        padding: 0.25em 1em;
    }
</style>

<form on:submit={importPrivateKey}>
    <input autoFocus type="text" name="privateKey" bind:value={key} />
    <button on:click={importPrivateKey}>Import Key</button>
</form>

<hr />

Show Legacy keys
<input type="checkbox" on:change={toggleLegacy} />

{#if $publicKeys}
    <table>
        <thead>
            <tr>
                <th>Public key</th>
                <th>Used By</th>
                <th>Controls</th>
            </tr>
        </thead>
        {#each $publicKeys as key}
            <tr>
                <td>
                    {#if legacy}
                        {PublicKey.from(key).toLegacyString()}
                    {:else}
                        {key}
                    {/if}
                </td>
                <td>
                    {#each $accounts.filter((a) => a.publicKey === key) as account}
                        <p>{account.name}@{account.permission}</p>
                    {/each}
                </td>
                <td>
                    <ElevatePrompt on:elevated={() => removeKey(key)}>
                        <button>Remove</button>
                    </ElevatePrompt>
                    <a href={`/accounts/import/publickey/${key}`}>Find Accounts</a>
                </td>
            </tr>
        {:else}
            <tr>
                <td colspan="3">No keys available.</td>
            </tr>
        {/each}
    </table>
{/if}
