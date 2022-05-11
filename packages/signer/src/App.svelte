<script lang="ts">
    import {writable} from 'svelte/store'
    import type {Writable} from 'svelte/store'
    import {onMount} from 'svelte'

    // Default writable store
    let example: Writable<boolean> = writable(true)

    onMount(async () => {
        // Call getStore and pass in the writable store as a reference
        await window?.getStore(example, 'isLoading')
    })
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
</style>

<main>
    <h1>Signing Window</h1>
    <p>isLoading: {$example}</p>
</main>
