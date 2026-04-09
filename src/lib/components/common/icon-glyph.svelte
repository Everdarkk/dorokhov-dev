<script lang="ts">
	export let name: string;
	export let size = 24;
	export let strokeWidth = 1.5;
	export let className = '';
</script>

{#if name === 'profile'}
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={strokeWidth} stroke-linecap="round" stroke-linejoin="round" width={size} height={size} class={className} aria-hidden="true">
		<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
		<circle cx="12" cy="7" r="4" />
	</svg>
{:else if name === 'deploys'}
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={strokeWidth} stroke-linecap="round" stroke-linejoin="round" width={size} height={size} class={className} aria-hidden="true">
		<path d="M12 2L8.5 9h7L12 2z" />
		<path d="M8.5 9 4 17h16L15.5 9" />
		<line x1="12" y1="17" x2="12" y2="22" />
		<line x1="9" y1="22" x2="15" y2="22" />
	</svg>
{:else if name === 'idea'}
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width={size} height={size} class={className} aria-hidden="true">
		<path d="M9 18h6" />
		<path d="M10 22h4" />
		<path d="M12 2a7 7 0 0 1 7 7c0 2.5-1.3 4.7-3.3 6l-.7.5V18H9v-2.5l-.7-.5A7 7 0 0 1 12 2z" />
	</svg>
{:else if name === 'uiux' || name === 'pen'}
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width={size} height={size} class={className} aria-hidden="true">
		<path d="M12 19l7-7 3 3-7 7-3-3z" />
		<path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
		<path d="M2 2l7.586 7.586" />
		<circle cx="11" cy="11" r="2" />
	</svg>
{:else if name === 'development' || name === 'code'}
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width={size} height={size} class={className} aria-hidden="true">
		<polyline points="16 18 22 12 16 6" />
		<polyline points="8 6 2 12 8 18" />
		<line x1="12" y1="2" x2="12" y2="22" opacity="0.35" />
	</svg>
{:else if name === 'testing'}
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width={size} height={size} class={className} aria-hidden="true">
		<path d="M9 3h6" />
		<path d="M10 3v6l-4 9a1 1 0 0 0 .9 1.4h10.2a1 1 0 0 0 .9-1.4L14 9V3" />
		<line x1="6.4" y1="15" x2="17.6" y2="15" />
	</svg>
{:else if name === 'launch' || name === 'rocket'}
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width={size} height={size} class={className} aria-hidden="true">
		<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
		<path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
		<path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
		<path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
	</svg>
{:else if name === 'support'}
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width={size} height={size} class={className} aria-hidden="true">
		<polyline points="23 4 23 10 17 10" />
		<polyline points="1 20 1 14 7 14" />
		<path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10" />
		<path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14" />
	</svg>
{:else if name === 'shield'}
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={strokeWidth} stroke-linecap="round" stroke-linejoin="round" width={size} height={size} class={className} aria-hidden="true">
		<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
		<polyline points="9 12 11 14 15 10" />
	</svg>
{:else if name === 'radar'}
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={strokeWidth} stroke-linecap="round" stroke-linejoin="round" width={size} height={size} class={className} aria-hidden="true">
		<circle cx="12" cy="12" r="2" />
		<path d="M12 2a10 10 0 0 1 0 20A10 10 0 0 1 12 2" />
		<path d="M12 6a6 6 0 0 1 0 12A6 6 0 0 1 12 6" />
		<line x1="12" y1="12" x2="19" y2="5" />
	</svg>
{:else if name === 'landing'}
	<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width={size} height={size} class={className} aria-hidden="true">
		<rect x="6" y="8" width="52" height="48" rx="4" stroke-width="1.5" />
		<line x1="6" y1="20" x2="58" y2="20" stroke-width="1.5" />
		<circle cx="14" cy="14" r="2.5" fill="currentColor" stroke="none" opacity="0.9" />
		<circle cx="22" cy="14" r="2.5" fill="currentColor" stroke="none" opacity="0.55" />
		<circle cx="30" cy="14" r="2.5" fill="currentColor" stroke="none" opacity="0.25" />
		<rect x="36" y="11" width="16" height="6" rx="3" fill="currentColor" opacity="0.1" stroke-width="1" stroke-opacity="0.3" />
		<rect x="38.5" y="13" width="3" height="2.5" rx="0.5" fill="currentColor" stroke="none" opacity="0.45" />
		<path d="M39 13 Q39 11.5 41 11.5 Q43 11.5 43 13" stroke-width="1" stroke-opacity="0.45" fill="none" />
		<rect x="12" y="26" width="40" height="5" rx="2" fill="currentColor" opacity="0.18" />
		<rect x="12" y="34" width="28" height="3" rx="1.5" fill="currentColor" opacity="0.1" />
		<rect x="12" y="40" width="34" height="2" rx="1" fill="currentColor" opacity="0.07" />
		<rect x="12" y="44" width="26" height="2" rx="1" fill="currentColor" opacity="0.07" />
		<rect x="38" y="38" width="14" height="8" rx="4" fill="currentColor" opacity="0.2" stroke-width="1.2" />
		<line x1="41" y1="42" x2="49" y2="42" stroke-width="1.2" opacity="0.7" />
		<polyline points="46,39.5 49,42 46,44.5" stroke-width="1.2" opacity="0.7" fill="none" />
	</svg>
{:else if name === 'dashboard'}
	<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width={size} height={size} class={className} aria-hidden="true">
		<rect x="4" y="6" width="56" height="52" rx="4" stroke-width="1.5" />
		<line x1="20" y1="6" x2="20" y2="58" stroke-width="1.5" />
		<line x1="20" y1="20" x2="60" y2="20" stroke-width="1.5" />
		<rect x="8" y="10" width="8" height="6" rx="1.5" fill="currentColor" opacity="0.35" stroke="none" />
		<rect x="8" y="24" width="8" height="6" rx="1.5" fill="currentColor" opacity="0.55" stroke="none" />
		<rect x="8" y="33" width="8" height="6" rx="1.5" fill="currentColor" opacity="0.25" stroke="none" />
		<rect x="8" y="42" width="8" height="6" rx="1.5" fill="currentColor" opacity="0.25" stroke="none" />
		<circle cx="19" cy="27" r="1.5" fill="currentColor" stroke="none" opacity="0.8" />
		<circle cx="26" cy="14" r="1.5" fill="currentColor" stroke="none" opacity="0.5" />
		<circle cx="32" cy="14" r="1.5" fill="currentColor" stroke="none" opacity="0.25" />
		<rect x="26" y="26" width="11" height="8" rx="2" fill="currentColor" opacity="0.12" stroke-width="1.1" />
		<rect x="41" y="26" width="15" height="8" rx="2" fill="currentColor" opacity="0.2" stroke-width="1.1" />
		<line x1="26" y1="42" x2="56" y2="42" stroke-width="1.2" opacity="0.35" />
		<rect x="28" y="46" width="4" height="6" rx="1" fill="currentColor" opacity="0.35" stroke="none" />
		<rect x="35" y="40" width="4" height="12" rx="1" fill="currentColor" opacity="0.55" stroke="none" />
		<rect x="42" y="35" width="4" height="17" rx="1" fill="currentColor" opacity="0.8" stroke="none" />
		<rect x="49" y="30" width="4" height="22" rx="1" fill="currentColor" opacity="0.35" stroke="none" />
	</svg>
{:else if name === 'design'}
	<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width={size} height={size} class={className} aria-hidden="true">
		<rect x="7" y="9" width="50" height="46" rx="5" stroke-width="1.5" />
		<line x1="32" y1="9" x2="32" y2="55" stroke-width="1.2" opacity="0.25" />
		<line x1="7" y1="32" x2="57" y2="32" stroke-width="1.2" opacity="0.25" />
		<circle cx="20" cy="21" r="6" stroke-width="1.5" />
		<circle cx="20" cy="21" r="2.3" fill="currentColor" stroke="none" opacity="0.75" />
		<path d="M41 18l7 7" stroke-width="1.6" />
		<path d="M36.5 29.5l11.5-11.5 3 3L39.5 32.5l-5 1z" stroke-width="1.5" />
		<path d="M16 44h19" stroke-width="1.6" opacity="0.7" />
		<path d="M16 49h11" stroke-width="1.6" opacity="0.35" />
		<rect x="40" y="40" width="10" height="8" rx="2" fill="currentColor" opacity="0.16" stroke-width="1.1" />
	</svg>
{:else}
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={strokeWidth} stroke-linecap="round" stroke-linejoin="round" width={size} height={size} class={className} aria-hidden="true">
		<circle cx="12" cy="12" r="9" />
		<path d="M12 8v4l2.5 2.5" />
	</svg>
{/if}