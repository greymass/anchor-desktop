<script lang="ts">
    import {writable} from 'svelte/store'
    import type {Writable} from 'svelte/store'
    import {onMount} from 'svelte'

    // Default value
    let isLoading: Writable<boolean> = writable(false)

    onMount(async () => {
        // Call getStore and pass in the writable store as a reference along with the key for storage
        await anchor.storage.get(isLoading, 'isLoading')
    })

    async function onclick() {
        // Toggle the value to show changes
        isLoading.set(!$isLoading)
    }
</script>

<style>
    button {
        font-family: inherit;
        font-size: inherit;
        padding: 1em 2em;
        color: #ff3e00;
        background-color: rgba(255, 62, 0, 0.1);
        border-radius: 2em;
        border: 2px solid rgba(255, 62, 0, 0);
        outline: none;
        width: 200px;
        font-variant-numeric: tabular-nums;
        cursor: pointer;
    }

    button:focus {
        border: 2px solid #ff3e00;
    }

    button:active {
        background-color: rgba(255, 62, 0, 0.2);
    }
</style>

<button on:click={onclick}> Toggle Value ({$isLoading}) </button>
