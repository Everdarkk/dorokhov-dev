<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>Something went wrong</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="error-shell" aria-labelledby="error-title">
	<div class="error-panel">
		<p class="error-code">ERROR_{page.status}</p>
		<h1 id="error-title">Request interrupted</h1>
		<p class="error-message">{page.error?.message ?? 'Something went wrong while loading this page.'}</p>
		<a class="error-link" href={resolve('/')}>Return home</a>
	</div>
</section>

<style>
	.error-shell {
		min-height: 100dvh;
		display: grid;
		place-items: center;
		padding: 2rem;
		background:
			radial-gradient(circle at top, rgba(0, 245, 255, 0.08), transparent 35%),
			radial-gradient(circle at bottom, rgba(255, 0, 85, 0.08), transparent 30%),
			#06060a;
	}

	.error-panel {
		max-width: 40rem;
		padding: 2rem;
		border: 1px solid rgba(255, 255, 255, 0.12);
		background: rgba(9, 10, 16, 0.9);
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
	}

	.error-code {
		margin: 0 0 0.75rem;
		color: #00f5ff;
		letter-spacing: 0.18em;
		font-size: 0.8rem;
	}

	h1 {
		margin: 0 0 1rem;
		font-size: clamp(2rem, 5vw, 3.5rem);
		line-height: 1;
	}

	.error-message {
		margin: 0 0 1.5rem;
		color: rgba(224, 232, 240, 0.88);
		line-height: 1.6;
	}

	.error-link {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.8rem 1.25rem;
		color: #06060a;
		background: #00f5ff;
		text-decoration: none;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
</style>