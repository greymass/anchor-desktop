<script lang="ts">
    import {onMount} from 'svelte'
    import {derived, writable, type Writable} from 'svelte/store'
    import {meta} from 'tinro'

    import type {Account, LighthouseResponse} from '@types'
    import {accounts} from '@stores/accounts'

    const route = meta()

    let results: Writable<any> = writable([])
    let loaded: Writable<boolean> = writable(false)

    function encodeKey(account: Account): string {
        return [account.chainId, account.name, account.permission, account.publicKey].join('|')
    }

    function decodeKey(key: string): Account {
        const [chainId, name, permission, publicKey] = key.split('|')
        return {
            chainId,
            name,
            permission,
            publicKey,
        }
    }

    const exists = derived(accounts, ($accounts: Account[]) => {
        const existing: Record<string, boolean> = {}
        $accounts.forEach((account: Account) => {
            existing[encodeKey(account)] = true
        })
        return existing
    })

    const lighthouseURL = 'https://eosio.greymass.com'
    function lookup(publicKey: string): Promise<Array<LighthouseResponse>> {
        return fetch(`${lighthouseURL}/lookup/${publicKey}?includeTestnets`)
            .then((res) => {
                loaded.set(true)
                return res.json()
            })
            .then((json) => {
                results.set(json)
                return json
            })
            .catch((error) => {
                throw error
            })
    }

    function toggleAccount(event: HTMLInputFormEvent) {
        const {checked, value} = event.currentTarget
        const account = decodeKey(value)
        if (checked && !$exists[value]) {
            addAccount(account)
        } else if (!checked && $exists[value]) {
            removeAccount(account)
        }
    }

    function addAccount(account: Account) {
        window.anchor.accounts.add(account)
    }

    function removeAccount(account: Account) {
        window.anchor.accounts.remove(account)
    }

    onMount(async () => {
        lookup(route.params.publickey)
    })
</script>

<style lang="scss" global>
</style>

<p>Lookup for: {route.params.publickey}</p>
<table>
    <thead>
        <tr>
            <th>Network</th>
            <th>Account</th>
            <th>Controls</th>
        </tr>
    </thead>
    {#if $loaded}
        {#each $results as network}
            {#each network.accounts as account}
                {@const accountDef = {
                    chainId: network.chainId,
                    name: account.actor,
                    permission: account.permission,
                    publicKey: route.params.publickey,
                }}
                {@const accountKey = encodeKey(accountDef)}
                <tr>
                    <td
                        ><input
                            type="checkbox"
                            checked={$exists[accountKey]}
                            value={accountKey}
                            on:change={toggleAccount}
                        /></td
                    >
                    <td>{network.network}</td>
                    <td>{account.actor}@{account.permission}</td>
                </tr>
            {/each}
        {:else}
            <tr>
                <td colspan="3">No accounts found.</td>
            </tr>
        {/each}
    {:else}
        <tr>
            <td colspan="3">Loading...</td>
        </tr>
    {/if}
</table>
