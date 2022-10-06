<script lang="ts">
    import {Route} from 'tinro'

    import {initialized, unlocked} from '@stores/signer'

    import HeaderBar from './components/HeaderBar.svelte'
    import LockScreen from './components/LockScreen.svelte'
    import Sidebar from './components/Sidebar.svelte'

    import Accounts from './sections/accounts/index.svelte'
    import Keys from './sections/keys/index.svelte'
    import Settings from './sections/settings/index.svelte'
    import Setup from './sections/setup/index.svelte'
</script>

<style lang="scss" global>
    $grid_gap: 1em;
    $navigation_width: 120px;
    $menubar_height: 78px;
    $bottom_padding: 0em;
    :global(body) {
        padding: 0;
        margin: 0;
    }
    .container {
        display: grid;
        column-gap: $grid_gap;
        row-gap: calc(#{$grid_gap} / 2);
        grid-template-columns: $navigation_width auto 0;
        grid-template-rows: $menubar_height minmax(0, auto);
        grid-template-areas:
            'leftbar header'
            'leftbar main';
        &.withoutsidebar {
            grid-template-rows: $menubar_height auto;
            grid-template-columns: 100%;
            grid-template-areas:
                'header'
                'main';
            .page-header {
                left: 0;
                right: 0;
            }
        }
        &.navigation {
            max-height: 100vh;
            overflow: hidden;
        }

        &.noRowGap {
            row-gap: 0;
        }

        :global(.account-button) {
            right: $grid_gap;
        }
    }
    .header {
        grid-area: header;
        position: fixed;
        z-index: 1000;
        top: 0;
        left: calc(#{$navigation_width} + #{$grid_gap});
        right: $grid_gap;
        height: $menubar_height;
    }

    .content {
        grid-area: main;
        padding-bottom: $bottom_padding;
        > * {
            margin: 0 auto;
        }
    }
</style>

{#if $initialized}
    {#if $unlocked}
        <div class="container">
            <Sidebar />
            <div class="header">
                <HeaderBar />
            </div>
            <div class="content">
                <Route path="/" />
                <Route path="/accounts/*">
                    <Accounts />
                </Route>
                <Route path="/keys">
                    <Keys />
                </Route>
                <Route path="/settings">
                    <Settings />
                </Route>
            </div>
        </div>
    {:else}
        <LockScreen />
    {/if}
{:else}
    <Setup />
{/if}
