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
  const profilePageSchema = $derived(JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    name: title,
    description,
    url: canonicalUrl,
    mainEntity: {
      '@type': 'Person',
      name: 'Oleksandr Dorokhov',
      jobTitle: 'Full-Stack Developer',
      description,
      url: siteUrl,
      knowsAbout: ['Web Development', 'SvelteKit', 'Next.js', 'TypeScript', 'PostgreSQL', 'Full-Stack Development', 'UI/UX Design'],
      knowsLanguage: ['English', 'Ukrainian'],
      sameAs: [
        'https://github.com/Everdarkk',
        'https://www.linkedin.com/in/oleksandr-dorokhov-632b59303/',
        'https://t.me/everdarkk'
      ]
    }
  }));
  const breadcrumbSchema = $derived(JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Profile', item: canonicalUrl }
    ]
  }));
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonicalUrl} />
  <meta property="og:type" content="profile" />
  <meta property="og:profile:first_name" content="Oleksandr" />
  <meta property="og:profile:last_name" content="Dorokhov" />
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

  <svelte:element this={'script'} type="application/ld+json">{profilePageSchema}</svelte:element>
  <svelte:element this={'script'} type="application/ld+json">{breadcrumbSchema}</svelte:element>
</svelte:head>

<!-- STRUCTURE -->
<ProfileHero />
<ProfileExpertise />
<ProfileApproach />
<ProfileCta />
