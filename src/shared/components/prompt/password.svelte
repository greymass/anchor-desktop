<script lang="ts">
    import {createEventDispatcher, onMount} from 'svelte'

    const dispatch = createEventDispatcher<{submit: HTMLFormElement}>()

    let input: HTMLInputElement
    export let password: string = ''
    export let validate: boolean = true

    onMount(() => {
        input.focus()
    })

    async function submit(event: any) {
        event.preventDefault()
        const valid = await window.anchor.signer.validatePassword(password)
        if (!validate || valid) {
            dispatch('submit', event)
        }
        password = ''
    }
</script>

<style>
</style>

<main>
    <form on:submit={submit}>
        <input bind:this={input} type="password" name="password" bind:value={password} />
        <input type="submit" />
    </form>
</main>
