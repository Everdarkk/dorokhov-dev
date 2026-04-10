<script lang="ts">
  import { page } from "$app/state";
  import ProfileHero     from "$lib/components/sections/profile-hero-section.svelte";
  import ProfileExpertise from "$lib/components/sections/profile-expertise-section.svelte";
  import ProfileApproach from "$lib/components/sections/profile-approach-section.svelte";
  import ProfileCta      from "$lib/components/sections/profile-cta-section.svelte";

  let { data } = $props();
  const FALLBACK_SITE_URL = 'https://od.business';
  const siteUrl = $derived((data?.siteUrl ?? FALLBACK_SITE_URL).replace(/\/$/, ''));

  const title = "Oleksandr Dorokhov - Full-Stack Developer & Web Architect";
  const description =
    "Full-stack developer based in Ukraine and available for remote projects worldwide. Expert in SvelteKit, Next.js, TypeScript, and PostgreSQL, building fast and scalable web experiences.";
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
      '@type': 'ProfilePage',
      name: title,
      description,
      url: canonicalUrl,
      mainEntity: {
        '@type': 'Person',
        name: 'Oleksandr Dorokhov'
      }
    })}
  </script>
</svelte:head>

<!-- STRUCTURE -->
<ProfileHero />
<ProfileExpertise />
<ProfileApproach />
<ProfileCta />
