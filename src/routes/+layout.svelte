<script lang="ts">
	import favicon from '$lib/assets/favicon.svg'
	import { onMount } from 'svelte'
	import '../app.css'
	import Navigation from '$lib/components/layout/navigation.svelte'
	import Footer from '$lib/components/layout/footer.svelte'

	let { children } = $props()
	let CursorComponent = $state<((typeof import('$lib/components/layout/cursor.svelte'))['default'] | null)>(null)

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
	<link rel="icon" href={favicon} />
	
	<title>Custom Website Development — Fast, Modern, Results-Driven</title>
	<meta name="description" content="Professional Full-Stack developer building fast, scalable websites and web apps. Custom solutions with authentication, databases, and modern UI.">
</svelte:head>


<Navigation />
{@render children()}
<Footer />

{#if CursorComponent}
	<CursorComponent />
{/if}