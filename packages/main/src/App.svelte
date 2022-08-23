<script lang="ts">
    import logo from './assets/anchor-logo-lightmode.svg'

    function test() {
        window.anchor.exampleRequest()
    }
</script>

<style>
    :root {
        font-family: -apple-system, Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
            sans-serif;
    }

    main {
        text-align: center;
        padding: 3em;
        margin: 0 auto;
    }

    img {
        height: 16rem;
        width: 16rem;
    }
</style>

<main>
    <img src={logo} alt="Anchor Logo" />
    <h2>Initiate a signing request</h2>
    <p>Example request:</p>
    <button on:click={test}>Prompt Request</button>
</main>
