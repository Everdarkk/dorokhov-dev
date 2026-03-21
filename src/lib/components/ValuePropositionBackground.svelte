<script lang="ts">
	/**
	 * ValuePropositionBackground Component
	 * 
	 * Creates a dynamic, futuristic background with subtle animations
	 * optimized for performance using CSS animations and minimal JavaScript
	 */

	import { onMount } from 'svelte';

	let containerRef: HTMLDivElement;
	let particleCount = 30;
	let particles: Array<{
		id: number;
		x: number;
		y: number;
		size: number;
		duration: number;
		delay: number;
	}> = [];

	onMount(() => {
		// Adjust particle count based on screen size for better performance
		const screenWidth = window.innerWidth;
		if (screenWidth < 768) {
			particleCount = 20;
		} else if (screenWidth < 1024) {
			particleCount = 25;
		} else {
			particleCount = 30;
		}

		// Generate particles
		particles = Array.from({ length: particleCount }, (_, i) => ({
			id: i,
			x: Math.random() * 100,
			y: Math.random() * 100,
			size: Math.random() * 3 + 1,
			duration: Math.random() * 15 + 10,
			delay: Math.random() * 5
		}));

		// Handle responsive updates
		const handleResize = () => {
			const newWidth = window.innerWidth;
			let targetParticleCount;

			if (newWidth < 768) {
				targetParticleCount = 20;
			} else if (newWidth < 1024) {
				targetParticleCount = 25;
			} else {
				targetParticleCount = 30;
			}

			if (targetParticleCount === particles.length) {
				return; // No change needed
			}

			particleCount = targetParticleCount;

			if (targetParticleCount < particles.length) {
				// Reduce particles
				particles = particles.slice(0, targetParticleCount);
			} else {
				// Add particles
				const newParticles = Array.from(
					{ length: targetParticleCount - particles.length },
					(_, i) => ({
						id: particles.length + i,
						x: Math.random() * 100,
						y: Math.random() * 100,
						size: Math.random() * 3 + 1,
						duration: Math.random() * 15 + 10,
						delay: Math.random() * 5
					})
				);
				particles = [...particles, ...newParticles];
			}
		};

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	});
</script>

<!-- Background container with grid pattern and animated elements -->
<div class="vp-bg" bind:this={containerRef}>
	<!-- Grid pattern overlay -->
	<div class="vp-bg__grid"></div>

	<!-- Animated gradient orbs -->
	<div class="vp-bg__orb vp-bg__orb--cyan"></div>
	<div class="vp-bg__orb vp-bg__orb--pink"></div>
	<div class="vp-bg__orb vp-bg__orb--purple"></div>

	<!-- Animated particles -->
	<div class="vp-bg__particles">
		{#each particles as particle (particle.id)}
			<div
				class="vp-bg__particle"
				style="
					--particle-x: {particle.x}%;
					--particle-y: {particle.y}%;
					--particle-size: {particle.size}px;
					--particle-duration: {particle.duration}s;
					--particle-delay: {particle.delay}s;
				"
			></div>
		{/each}
	</div>

	<!-- Scanline effect -->
	<div class="vp-bg__scanlines"></div>

	<!-- Noise overlay -->
	<div class="vp-bg__noise"></div>
</div>

<style>
	.vp-bg {
		position: absolute;
		inset: 0;
		overflow: hidden;
		opacity: 0.4;
		z-index: 0;
	}

	/* Grid pattern background */
	.vp-bg__grid {
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(
				rgba(0, 247, 255, 0.1) 1px,
				transparent 1px
			),
			linear-gradient(
				90deg,
				rgba(0, 247, 255, 0.1) 1px,
				transparent 1px
			);
		background-size: 40px 40px;
		pointer-events: none;
		animation: gridShift 20s linear infinite;
		will-change: background-position;
	}

	@keyframes gridShift {
		0% {
			background-position: 0 0;
		}
		100% {
			background-position: 40px 40px;
		}
	}

	/* Animated gradient orbs */
	.vp-bg__orb {
		position: absolute;
		border-radius: 50%;
		filter: blur(80px);
		will-change: transform, opacity;
	}

	.vp-bg__orb--cyan {
		width: 400px;
		height: 400px;
		background: radial-gradient(circle, rgba(0, 245, 255, 0.15) 0%, transparent 70%);
		top: -100px;
		left: -100px;
		animation: float 15s ease-in-out infinite;
	}

	.vp-bg__orb--pink {
		width: 350px;
		height: 350px;
		background: radial-gradient(circle, rgba(255, 0, 85, 0.15) 0%, transparent 70%);
		bottom: -50px;
		right: 10%;
		animation: floatReverse 18s ease-in-out infinite;
	}

	.vp-bg__orb--purple {
		width: 300px;
		height: 300px;
		background: radial-gradient(circle, rgba(179, 0, 255, 0.15) 0%, transparent 70%);
		top: 50%;
		right: -100px;
		animation: float 20s ease-in-out infinite 5s;
	}

	@keyframes float {
		0%, 100% {
			transform: translate(0, 0);
		}
		25% {
			transform: translate(30px, -30px);
		}
		50% {
			transform: translate(0, 30px);
		}
		75% {
			transform: translate(-30px, -20px);
		}
	}

	@keyframes floatReverse {
		0%, 100% {
			transform: translate(0, 0);
		}
		25% {
			transform: translate(-30px, 30px);
		}
		50% {
			transform: translate(0, -30px);
		}
		75% {
			transform: translate(30px, 20px);
		}
	}

	/* Particles container */
	.vp-bg__particles {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	/* Individual particles with per-particle animation */
	.vp-bg__particle {
		position: absolute;
		width: var(--particle-size);
		height: var(--particle-size);
		background: radial-gradient(circle, rgba(0, 245, 255, 0.8), transparent);
		border-radius: 50%;
		left: var(--particle-x);
		top: var(--particle-y);
		pointer-events: none;
		animation: particleFloat var(--particle-duration) ease-in-out infinite;
		animation-delay: var(--particle-delay);
	}

	@keyframes particleFloat {
		0%, 100% {
			transform: translate(0, 0) scale(1);
			opacity: 0.3;
		}
		50% {
			transform: translate(var(--particle-offset-x, 50px), var(--particle-offset-y, -50px)) scale(1.2);
			opacity: 0.8;
		}
	}

	/* Scanline effect for cyberpunk aesthetic */
	.vp-bg__scanlines {
		position: absolute;
		inset: 0;
		background-image: repeating-linear-gradient(
			0deg,
			rgba(0, 0, 0, 0.1),
			rgba(0, 0, 0, 0.1) 1px,
			transparent 1px,
			transparent 2px
		);
		pointer-events: none;
		animation: scanlineMove 8s linear infinite;
		will-change: background-position;
	}

	@keyframes scanlineMove {
		0% {
			background-position: 0 0;
		}
		100% {
			background-position: 0 10px;
		}
	}

	/* Noise texture overlay */
	.vp-bg__noise {
		position: absolute;
		inset: 0;
		background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' seed='2'/%3E%3C/filter%3E%3Crect width='400' height='400' fill='%23ffffff' filter='url(%23noiseFilter)' opacity='0.02'/%3E%3C/svg%3E");
		pointer-events: none;
		opacity: 0.3;
		animation: noiseShift 3s steps(5) infinite;
	}

	@keyframes noiseShift {
		0% {
			opacity: 0.25;
		}
		50% {
			opacity: 0.35;
		}
		100% {
			opacity: 0.25;
		}
	}

	/* Mobile optimization */
	@media (max-width: 768px) {
		.vp-bg__orb--cyan {
			width: 300px;
			height: 300px;
			animation: float 15s ease-in-out infinite;
		}

		.vp-bg__orb--pink {
			width: 250px;
			height: 250px;
			animation: floatReverse 18s ease-in-out infinite;
		}

		.vp-bg__orb--purple {
			width: 200px;
			height: 200px;
			animation: float 20s ease-in-out infinite 5s;
		}

		.vp-bg__grid {
			background-size: 30px 30px;
		}
	}

	/* Reduce animations on low-power devices */
	@media (prefers-reduced-motion: reduce) {
		.vp-bg__grid,
		.vp-bg__orb,
		.vp-bg__particle,
		.vp-bg__scanlines,
		.vp-bg__noise {
			animation: none !important;
		}

		.vp-bg__orb {
			opacity: 0.8;
		}
	}
</style>
