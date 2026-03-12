<script lang="ts">
    // Menu list
    const menu: string[] = ['profile', 'skills', 'deploys', 'connections']
</script>

<!-- MARKUP -->
<header class="header">
    <!-- LOGO PLACE -->
    <img src="#" alt="Logo">
    
    <nav class="nav">
        <!-- MENU -->
        <ul class="menu">
            {#each menu as item, id(id) }
                <li class="item">
                    <a aria-label={item} href="#" class="link">{item}</a>
                </li>
            {/each}
        </ul>

        <!-- BURGER -->
    </nav>
</header>

<!-- STYLES -->
<style>
    .header {
        position: relative;
        z-index: 1;
        width: 100%;
        height: 4rem;
        background-color: red;
        display: flex;
        justify-content: center;
        align-items: center;

    }

    .nav {
        width: clamp(250px, 60vw, 1200px);
        height: 100%;
        background-color: blue;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .menu {
        display: flex;
        align-items: center;
        justify-content: space-around;
        gap: 2rem;
    }
</style>