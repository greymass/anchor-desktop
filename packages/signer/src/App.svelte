<script lang="ts">
    import {Name} from '@greymass/eosio'
    import {sharedName} from '../../stores'

    const test = Name.from('teamgreymass')
</script>

<style>
    :root {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
            Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }

    main {
        text-align: center;
        padding: 1em;
        margin: 0 auto;
    }

    h1 {
        color: #ff3e00;
        text-transform: uppercase;
        font-size: 4rem;
        font-weight: 100;
        line-height: 1.1;
        margin: 2rem auto;
    }
</style>

<main>
    <h1>Sign transactions for {test}!</h1>
    <p>Name: {$sharedName}</p>
    <button on:click={() => sharedName.set(Name.from('bar'))}> Change to bar </button>
</main>
