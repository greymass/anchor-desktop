<script lang="ts">
    import {sessions} from '@stores/session'

    console.log(sessions)
</script>

{#if $sessions}
    <table>
        <thead>
            <tr>
                <th>Public key</th>
                <th>Used By</th>
                <th>Controls</th>
            </tr>
        </thead>
        {#each $sessions as session}
            <tr>
                <td>
                    <pre>{JSON.stringify(session, null, 2)}</pre>
                </td>
            </tr>
        {:else}
            <tr>
                <td colspan="3">No sessions.</td>
            </tr>
        {/each}
    </table>
{/if}

<style>
    table,
    table * {
        border: 1px solid black;
        text-align: left;
    }
    table td,
    th {
        padding: 0.25em 1em;
    }
</style>
