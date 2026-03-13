<script lang="ts">
    import Background from "$lib/components/Background.svelte";
</script>

<!-- STRUCTURE -->
<section class="hero" id="hero">
    <Background />
    <div class="main">
        Hello! My name is Oleksandr!
    </div>
</section>

<style>
    .hero {
        height: 100dvh;
    }
    .main {
        position: relative;
        z-index: 0;
    }
</style>