<script lang="ts">
    import PasswordPrompt from '../../../shared/components/prompt/password.svelte'
    let password: string
    async function validatePassword(event: Event) {
        const validated = await window.anchor.signer.unlock(password)
        event.preventDefault()
        password = ''
    }
</script>

<style>
</style>

<p>Enter password to unlock</p>
<PasswordPrompt bind:password on:submit={validatePassword} />
