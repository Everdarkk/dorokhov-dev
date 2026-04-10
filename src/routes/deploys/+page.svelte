<script lang="ts">
  import { page } from "$app/state";
  import DeploysHero from "$lib/components/sections/deploys-hero-section.svelte";
  import RecentLaunches from "$lib/components/sections/recent-launches-section.svelte";

  let { data } = $props();

  const title = "Project Archive - Shipped Web Applications | Oleksandr Dorokhov";
  const description =
    "A showcase of shipped web applications, including personal brand sites, artist portfolios, full-stack social platforms, AI-powered tools, and live client projects.";
  const canonicalUrl = $derived(new URL(page.url.pathname, data.siteUrl).toString());
  const ogImageUrl = $derived(new URL('/og-image.png', data.siteUrl).toString());
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonicalUrl} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:image" content={ogImageUrl} />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={ogImageUrl} />

  <script type="application/ld+json">
    {JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: title,
      description,
      url: canonicalUrl,
      isPartOf: data.siteUrl
    })}
  </script>
</svelte:head>

<!-- STRUCTURE -->
<DeploysHero />
<RecentLaunches />
