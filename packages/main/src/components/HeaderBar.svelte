<script lang="ts">
    function lock() {
        window.anchor.signer.lock()
    }
</script>

<style>
</style>

<button on:click={lock}>Lock Wallet</button>
