<script lang="ts">
	import favicon from '$lib/assets/favicon.svg'
	import Cursor from '$lib/components/layout/cursor.svelte'
	import '../app.css'
	import Navigation from '$lib/components/layout/navigation.svelte'

	let { children } = $props()
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	
	<title>Custom Website Development — Fast, Modern, Results-Driven</title>
	<meta name="description" content="Professional Full-Stack developer building fast, scalable websites and web apps. Custom solutions with authentication, databases, and modern UI.">
</svelte:head>


<Navigation />
{@render children()}


<Cursor />