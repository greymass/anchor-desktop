<script lang="ts">
    import {Route} from 'tinro'

    import AccountImportPublicKey from './publickey.svelte'
</script>

<style lang="scss" global>
</style>

<Route path="/publickey/:publickey"><AccountImportPublicKey /></Route>
