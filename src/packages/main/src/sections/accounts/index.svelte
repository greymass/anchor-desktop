<script lang="ts">
    import {Route} from 'tinro'

    import {accounts} from '@stores/accounts'
    import {publicKeys} from '@stores/signer'
    import type {Account} from '@types'

    import ConfirmPrompt from '@shared/components/prompt/confirm.svelte'

    import AccountImport from '~/sections/accounts/import/index.html'

    function removeAccount(account: Account) {
        window.anchor.accounts.remove(account)
    }
</script>

<style lang="scss" global>
</style>

<Route path="/import/*" let:meta><AccountImport /></Route>
<Route path="/">
    <table>
        <thead>
            <tr>
                <th>Account</th>
                <th>Controls</th>
            </tr>
        </thead>
        {#if $accounts}
            {#each $accounts as account}
                <tr>
                    <td>
                        {account.name}@{account.permission}
                        {#if $publicKeys.includes(account.publicKey)}
                            <span>Ready</span>
                        {:else}
                            <span>KEY MISSING!</span>
                        {/if}
                    </td>
                    <td>
                        <ConfirmPrompt on:confirm={() => removeAccount(account)}>
                            <button>Remove</button>
                        </ConfirmPrompt>
                    </td>
                </tr>
            {/each}
        {:else}
            <tr>
                <td colspan="3">No accounts...</td>
            </tr>
        {/if}
    </table>
</Route>
