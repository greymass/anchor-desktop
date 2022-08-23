<script lang="ts">
    import {Name, Signature} from '@greymass/eosio'

    import {activeRequest} from '@stores/request'
    import {account, authority, permission} from '@stores/signer'

    import {currentSigningDigest, resolvedTransaction} from './request'

    let signature: Signature | undefined = undefined

    async function sign() {
        // Set current account/permission stores
        account.set(Name.from('corecorecore'))
        permission.set(Name.from('active'))
        // Get signature
        signature = await window.anchor.signDigest($currentSigningDigest)
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
    <h2>Sign transactions - {$account}@{$permission}</h2>
    <p>{$authority}</p>
    <button on:click={() => sign()}> Sign </button>
    <button on:click={() => close()}> Close </button>
    <p>Payload: {$activeRequest}</p>
    <p>Signature: {JSON.stringify(signature || 'Not signed')}</p>
    <p>Resolved:</p>
    <pre>{JSON.stringify($resolvedTransaction, null, '\t')}</pre>
</main>
