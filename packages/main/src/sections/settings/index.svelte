<script lang="ts">
    import ElevatePrompt from '@packages/shared/components/prompt/elevate.svelte'
    function reset(e: CustomEvent<string>) {
        window.anchor.wipe(e.detail)
    }
</script>

<style>
</style>

<ElevatePrompt on:elevated={reset}>
    <button>Reset</button>
</ElevatePrompt>
