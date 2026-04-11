<script lang="ts">
  import { page } from "$app/state";
  import DeploysHero from "$lib/components/sections/deploys-hero-section.svelte";
  import RecentLaunches from "$lib/components/sections/recent-launches-section.svelte";

  let { data } = $props();
  const FALLBACK_SITE_URL = 'https://od.business';
  const siteUrl = $derived((data?.siteUrl ?? FALLBACK_SITE_URL).replace(/\/$/, ''));

  const title = "Project Archive - Shipped Web Applications | Oleksandr Dorokhov";
  const description =
    "A showcase of shipped web applications, including personal brand sites, artist portfolios, full-stack social platforms, AI-powered tools, and live client projects.";
  const canonicalUrl = $derived(new URL(page.url.pathname, siteUrl).toString());
  const ogImageUrl = $derived(new URL('/og-image.png', siteUrl).toString());
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonicalUrl} />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:image" content={ogImageUrl} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={ogImageUrl} />

  {@html `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description,
    url: canonicalUrl,
    isPartOf: siteUrl
  })}</script>`}

  {@html `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Project Archive', item: canonicalUrl }
    ]
  })}</script>`}
</svelte:head>

<!-- STRUCTURE -->
<DeploysHero />
<RecentLaunches />
