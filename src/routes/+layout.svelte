<script lang="ts">
	import favicon from '$lib/assets/favicon.svg'
	import Cursor from '$lib/components/Cursor.svelte'
	import '../app.css'
	import Navigation from '$lib/components/Navigation.svelte'

	let { children } = $props()
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	
	<title>Custom Website Development — Fast, Modern, Results-Driven</title>
	<meta name="description" content="Professional Full-Stack developer building fast, scalable websites and web apps. Custom solutions with authentication, databases, and modern UI.">
	<script>
  		const baseTitle = "Custom Website Development — Fast, Modern, Results-Driven";
  		const symbols = ["⇐", "⇖", "⇑", "⇗", "⇒", "⇘", "⇓", "⇙", ];
  		let index = 0;

  		setInterval(() => {
    		document.title = `${symbols[index]} ${baseTitle}`;

			if (index === symbols.length + 1) {
				index = 0
			}
    		index = (index + 1) % symbols.length;
  		}, 250);
	</script>
</svelte:head>


<Navigation />
{@render children()}


<Cursor />