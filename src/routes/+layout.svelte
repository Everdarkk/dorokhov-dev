<script lang="ts">
	import favicon from '$lib/assets/favicon.svg'
	import Cursor from '$lib/components/Cursor.svelte'
	import '../app.css'
	import Navigation from '$lib/components/Navigation.svelte'

	let { children } = $props()
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>


<Navigation />
{@render children()}


<Cursor />