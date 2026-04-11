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
  import { FAQ_ITEMS } from "$lib/constants/faq";

  let { data } = $props();
  const FALLBACK_SITE_URL = 'https://od.business';
  const siteUrl = $derived((data?.siteUrl ?? FALLBACK_SITE_URL).replace(/\/$/, ''));

  const title = "Custom Website Development - Fast, Modern, Results-Driven";
  const description =
    "Professional full-stack developer building fast, scalable websites and web apps. Custom solutions with authentication, databases, and modern UI.";
  const canonicalUrl = $derived(new URL(page.url.pathname, siteUrl).toString());
  const ogImageUrl = $derived(new URL('/og-image.png', siteUrl).toString());

  const faqPageSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answerLines
          .filter(line => !!line.trim() && !line.trim().startsWith('>') && !line.trim().startsWith('[OK]'))
          .map(line => line.trim())
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim()
      }
    }))
  });
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
    '@type': 'WebSite',
    name: 'Oleksandr Dorokhov',
    url: siteUrl,
    description,
    inLanguage: 'en'
  })}</script>`}

  {@html `<script type="application/ld+json">${faqPageSchema}</script>`}
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