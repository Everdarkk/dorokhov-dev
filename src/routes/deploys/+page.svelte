<script lang="ts">
  import DeploysHero from "$lib/components/sections/deploys-hero-section.svelte";
  import RecentLaunches from "$lib/components/sections/recent-launches-section.svelte";
</script>

<svelte:head>
  <title>Project Archive — Shipped Web Applications | Oleksandr Dorokhov</title>
  <meta
    name="description"
    content="A showcase of 5 shipped web applications — personal brand sites, artist portfolios, full-stack social platforms, AI-powered tools, and live client projects. All deployed and battle-tested."
  />
  <meta property="og:title" content="Project Archive — Oleksandr Dorokhov" />
  <meta
    property="og:description"
    content="5 real-world web applications: Next.js, SvelteKit, TypeScript, Supabase. Live client projects and personal builds."
  />
</svelte:head>

<!-- STRUCTURE -->
<DeploysHero />
<RecentLaunches />
