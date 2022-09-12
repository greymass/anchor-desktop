<script lang="ts">
    import {createEventDispatcher} from 'svelte'
    import Modal from '../modal.svelte'
    import Password from './password.svelte'

    const dispatch = createEventDispatcher()

    export let password: string | undefined = ''
    export let open: boolean = false

    function trigger() {
        open = true
        password = undefined
    }

    function submit() {
        open = false
        dispatch('elevated', password)
    }
</script>

<style>
    form {
        display: inline-block;
    }
</style>

{#if open}
    <Modal bind:open>
        <p>Enter password to continue...</p>
        <Password bind:password on:submit={submit} />
    </Modal>
{/if}

<form on:submit|preventDefault={trigger}>
    <slot />
</form>
