<script lang="ts">
  import ProfileHero     from "$lib/components/sections/profile-hero-section.svelte";
  import ProfileExpertise from "$lib/components/sections/profile-expertise-section.svelte";
  import ProfileApproach from "$lib/components/sections/profile-approach-section.svelte";
  import ProfileCta      from "$lib/components/sections/profile-cta-section.svelte";
</script>

<svelte:head>
  <title>Oleksandr Dorokhov — Full-Stack Developer & Web Architect</title>
  <meta
    name="description"
    content="Full-Stack Developer based in Ukraine, available for remote projects worldwide. Expert in SvelteKit, Next.js, TypeScript, and PostgreSQL — building fast, scalable, conversion-focused web experiences."
  />
  <meta property="og:title" content="Oleksandr Dorokhov — Full-Stack Developer & Web Architect" />
  <meta
    property="og:description"
    content="5 shipped projects, 3 client builds, end-to-end development from Figma to production. SvelteKit · Next.js · TypeScript · PostgreSQL."
  />
</svelte:head>

<!-- STRUCTURE -->
<ProfileHero />
<ProfileExpertise />
<ProfileApproach />
<ProfileCta />
