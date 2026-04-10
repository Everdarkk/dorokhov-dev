<script lang="ts">
	import { page } from '$app/state'
	import { onMount } from 'svelte'
	import '../app.css'
	import Navigation from '$lib/components/layout/navigation.svelte'
	import Footer from '$lib/components/layout/footer.svelte'

	let { children, data } = $props()
	let CursorComponent = $state<((typeof import('$lib/components/layout/cursor.svelte'))['default'] | null)>(null)

	const SITE_NAME = 'Oleksandr Dorokhov'
	const DEFAULT_TITLE = 'Custom Website Development - Fast, Modern, Results-Driven'
	const DEFAULT_DESCRIPTION =
		'Professional full-stack developer building fast, scalable websites and web apps. Custom solutions with authentication, databases, and modern UI.'
	const DEFAULT_OG_IMAGE = '/og-image.png'
	const FALLBACK_SITE_URL = 'https://od.business'

	const siteUrl = $derived((data?.siteUrl ?? FALLBACK_SITE_URL).replace(/\/$/, ''))

	const canonicalUrl = $derived(new URL(page.url.pathname, siteUrl).toString())
	const ogImageUrl = $derived(new URL(DEFAULT_OG_IMAGE, siteUrl).toString())

	onMount(() => {
		let disposed = false

		const initCursor = async () => {
		if (typeof window === 'undefined') return

		const supportsFinePointer = window.matchMedia('(pointer: fine)').matches
		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

		if (!supportsFinePointer || reducedMotion) return

		const mod = await import('$lib/components/layout/cursor.svelte')
		if (disposed) return
		CursorComponent = mod.default
		}

		void initCursor()

		return () => {
			disposed = true
		}
	})
</script>

<svelte:head>
	<link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
	<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
	<link rel="shortcut icon" href="/favicon.ico" />
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<meta name="apple-mobile-web-app-title" content="od.business" />
	<link rel="manifest" href="/site.webmanifest" />

	<title>{DEFAULT_TITLE}</title>
	<meta name="description" content={DEFAULT_DESCRIPTION} />
	<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
	<link rel="canonical" href={canonicalUrl} />

	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:title" content={DEFAULT_TITLE} />
	<meta property="og:description" content={DEFAULT_DESCRIPTION} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:image" content={ogImageUrl} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={DEFAULT_TITLE} />
	<meta name="twitter:description" content={DEFAULT_DESCRIPTION} />
	<meta name="twitter:image" content={ogImageUrl} />

	<meta name="theme-color" content="#0f172a" />
	<meta name="format-detection" content="telephone=no" />

	<script type="application/ld+json">
		{JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'Person',
			name: 'Oleksandr Dorokhov',
			jobTitle: 'Full-Stack Developer',
			url: siteUrl,
			sameAs: [
				'https://github.com/Everdarkk',
				'https://www.linkedin.com/in/oleksandr-dorokhov-632b59303/',
				'https://t.me/everdarkk'
			]
		})}
	</script>
</svelte:head>


<Navigation />
{@render children()}
<Footer />

{#if CursorComponent}
	<CursorComponent />
{/if}