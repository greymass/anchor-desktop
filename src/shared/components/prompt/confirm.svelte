<script lang="ts">
    import {createEventDispatcher} from 'svelte'
    import Modal from '../modal.svelte'

    const dispatch = createEventDispatcher()

    export let open: boolean = false

    function trigger() {
        open = true
    }

    function confirm() {
        open = false
        dispatch('confirm')
    }

    function cancel() {
        open = false
    }
</script>

<style>
    form {
        display: inline-block;
    }
</style>

{#if open}
    <Modal bind:open>
        <p>Confirm this action</p>
        <button on:click={confirm}>Confirm</button>
        <button on:click={cancel}>Cancel</button>
    </Modal>
{/if}

<form on:submit|preventDefault={trigger}>
    <slot />
</form>
