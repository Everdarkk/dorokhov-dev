<script lang="ts">
  import { page } from "$app/state";
  import Hero from "$lib/components/sections/hero-section.svelte";
  import Marquee from "$lib/components/sections/marquee-section.svelte";
  import ValueProposition from "$lib/components/sections/value-proposition-section.svelte";
  import WorkProcess from "$lib/components/sections/work-process-section.svelte";
  import KeyServices from "$lib/components/sections/key-services-section.svelte";
  import Faq from "$lib/components/sections/faq-section.svelte";
  import Testimonials from "$lib/components/sections/testimonials-section.svelte";
  import Cta from "$lib/components/sections/cta-section.svelte";

  let { data } = $props();
  const FALLBACK_SITE_URL = 'https://od.business';
  const siteUrl = $derived((data?.siteUrl ?? FALLBACK_SITE_URL).replace(/\/$/, ''));

  const title = "Custom Website Development - Fast, Modern, Results-Driven";
  const description =
    "Professional full-stack developer building fast, scalable websites and web apps. Custom solutions with authentication, databases, and modern UI.";
  const canonicalUrl = $derived(new URL(page.url.pathname, siteUrl).toString());
  const ogImageUrl = $derived(new URL('/og-image.png', siteUrl).toString());
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
      '@type': 'WebSite',
      name: 'Oleksandr Dorokhov',
      url: siteUrl,
      description,
      inLanguage: 'en'
    })}
  </script>
</svelte:head>

<!-- STRUCTURE -->
<Hero />
<Marquee />
<ValueProposition />
<KeyServices />
<WorkProcess />
<Faq />
<Testimonials />
<Cta />