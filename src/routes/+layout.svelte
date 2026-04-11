<script lang="ts">
	import { onMount } from 'svelte'
	import '../app.css'
	import Navigation from '$lib/components/layout/navigation.svelte'
	import Footer from '$lib/components/layout/footer.svelte'

	let { children } = $props()
	let CursorComponent = $state<((typeof import('$lib/components/layout/cursor.svelte'))['default'] | null)>(null)

	const SITE_NAME = 'Oleksandr Dorokhov'

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

	<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
	<meta name="author" content="Oleksandr Dorokhov" />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:locale" content="en_US" />

	<meta name="theme-color" content="#0f172a" />
	<meta name="format-detection" content="telephone=no" />
</svelte:head>


<Navigation />
{@render children()}
<Footer />

{#if CursorComponent}
	<CursorComponent />
{/if}