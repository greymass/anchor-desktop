<script lang="ts">
    export let open: boolean = false

    function keydown(e) {
        if (open === true && e.keyCode == 27) {
            open = false
            e.preventDefault()
        }
    }
</script>

<style>
    .anchor-modal {
        background: #fff;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 1em 3em;
        border-radius: 8px;
        z-index: 1000;
    }
    .container,
    .anchor-modal-background {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }
    .container {
        display: none;
    }
    .container.open {
        display: flex;
    }
    .container:before {
        content: '';
        display: inline-block;
        width: 0;
        height: 100%;
        vertical-align: middle;
    }
    .anchor-modal-background {
        background-color: rgba(0, 0, 0, 0.5);
    }
</style>

<svelte:window on:keydown={keydown} />

<div class="container" class:open>
    <div class="anchor-modal">
        <slot />
    </div>
    <div class="anchor-modal-background" on:click={() => (open = false)} />
</div>
