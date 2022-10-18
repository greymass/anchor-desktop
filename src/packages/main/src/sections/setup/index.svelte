<script lang="ts">
    import PasswordPrompt from '@shared/components/prompt/password.svelte'

    let password: string = ''

    async function setPassword(event: Event) {
        console.log('setPassword', password)
        window.anchor.signer.setPassword(password)
        event.preventDefault()
        password = ''
    }
</script>

<style></style>

<p>Setup a new password</p>
<PasswordPrompt validate={false} bind:password on:submit={setPassword} />
