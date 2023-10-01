<script>
    import logo from '@assets/anchor-logo-lightmode.svg'
</script>

<div class="sidebar">
    <img src={logo} />
    <ul>
        <li>
            <a href="/">Home</a>
        </li>
        <li>
            <a href="/accounts">Accounts</a>
        </li>
        <li>
            <a href="/sessions">Sessions</a>
        </li>
        <li>
            <a href="/keys">Keys</a>
        </li>
        <li>
            <a href="/settings">Settings</a>
        </li>
    </ul>
</div>

<style lang="scss">
    .sidebar {
        min-height: 100vh;
        grid-area: leftbar;
        position: fixed;
        left: 0;
        img {
            width: 35px;
            padding: 20px;
        }
        ul {
            list-style-type: none;
            margin: 0;
            padding: 0 20px;
            li {
                padding: 10px;
                a {
                }
            }
        }
    }
</style>
