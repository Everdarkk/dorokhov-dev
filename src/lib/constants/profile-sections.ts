/**
 * Profile page continuation sections 
 *
 * SSoT for all copy, config, and data used in:
 *   profile-expertise-section.svelte
 *   profile-approach-section.svelte
 */



/* ═══════════════════════════════════════════════════════════════════════════
   EXPERTISE — "CAPABILITY_MAP"
   ═══════════════════════════════════════════════════════════════════════════ */

export const PROFILE_EXPERTISE_COPY = {
	sectionLabel: 'CAPABILITY_MAP',
	heading:      'What I Build',
	desc:         'Six service domains. One developer. Full accountability from first commit to production.',
} as const;

export const PROFILE_EXPERTISE_SERVICES = [
	{
		accent:  'cyan',
		label:   'Frontend Engineering',
		title:   'Pixel-Perfect Interfaces',
		desc:    'High-performance UIs in SvelteKit and Next.js. SSR, code-splitting, Core Web Vitals-first — pages that load fast and convert.',
		stack:   ['SvelteKit', 'Next.js', 'TypeScript', 'TailwindCSS', 'Framer Motion'],
	},
	{
		accent:  'pink',
		label:   'Backend & APIs',
		title:   'Reliable Server Logic',
		desc:    'REST APIs, authentication flows, business logic, and third-party integrations built on Node.js and Express with PostgreSQL.',
		stack:   ['Node.js', 'Express', 'PostgreSQL', 'Supabase', 'REST API'],
	},
	{
		accent:  'purple',
		label:   'Web Architecture',
		title:   'Scalable System Design',
		desc:    'Database schema design, deployment pipelines, monitoring with Sentry, and infrastructure choices that survive growth.',
		stack:   ['Vercel', 'Railway', 'Sentry', 'GitHub Actions', 'Postgres RLS'],
	},
	{
		accent:  'yellow',
		label:   'Design Implementation',
		title:   'Figma to Production',
		desc:    'Full fidelity from design file to running code. I read Figma fluently — components, auto-layout, variables, prototypes.',
		stack:   ['Figma', 'Design Tokens', 'CSS Custom Properties', 'Responsive Grid'],
	},
	{
		accent:  'green',
		label:   'Performance Optimisation',
		title:   'LCP · FID · CLS · INP',
		desc:    'Image strategy, font loading, bundle analysis, lazy boundaries — engineered for Core Web Vitals from the first commit.',
		stack:   ['WebP / AVIF', 'fetchpriority', 'Code Splitting', 'ISR / SSG', 'Lighthouse'],
	},
	{
		accent:  'orange',
		label:   'AI Integration',
		title:   'LLM-Powered Features',
		desc:    'Embedding AI into real products — chat interfaces, RAG pipelines, vector search, and structured output with streaming.',
		stack:   ['OpenAI API', 'Vercel AI SDK', 'pgvector', 'Streaming UI', 'Prompt Engineering'],
	},
] as const;

export type ProfileExpertiseAccent = (typeof PROFILE_EXPERTISE_SERVICES)[number]['accent'];

/* ═══════════════════════════════════════════════════════════════════════════
   APPROACH — "EXECUTION_PROTOCOL"
   ═══════════════════════════════════════════════════════════════════════════ */

export const PROFILE_APPROACH_COPY = {
	sectionLabel:   'EXECUTION_PROTOCOL',
	heading:        'The Client-First Protocol',
	desc:           'Every engagement follows the same five-phase framework — transparent, predictable, and built around your goals, not a generic template.',
	philosophyHead: 'Why custom code always wins',
	philosophyBody: 'Templates optimise for the developer\'s convenience, not your users\' experience. Custom code optimises for your conversion funnel, your brand, and your edge case. It costs more up front and pays for itself every month after.',
} as const;

export const PROFILE_APPROACH_PHASES = [
	{
		num:   '01',
		accent: 'cyan',
		title:  'Discovery',
		desc:   'Deep-dive into your goals, users, competitors, and constraints. We agree on scope, timeline, and success metrics before writing a line of code.',
	},
	{
		num:   '02',
		accent: 'pink',
		title:  'Design',
		desc:   'Wireframes, component inventory, and visual direction in Figma. You see exactly what you\'re getting before development begins — no surprises.',
	},
	{
		num:   '03',
		accent: 'purple',
		title:  'Development',
		desc:   'Iterative sprints with a live staging URL you can access at any time. Weekly check-ins, async updates on Telegram or email — you\'re never left guessing.',
	},
	{
		num:   '04',
		accent: 'yellow',
		title:  'Launch',
		desc:   'Performance audit, cross-browser QA, SEO check, and zero-downtime deployment. We ship when it\'s ready — not when the calendar says to.',
	},
	{
		num:   '05',
		accent: 'green',
		title:  'Support',
		desc:   'Post-launch monitoring, bug fixes, and feature iterations. Long-term partnerships are how I do my best work — I stay invested after go-live.',
	},
] as const;

export const PROFILE_APPROACH_DIFFERENTIATORS = [
	{ label: 'You talk to the developer, not a project manager' },
	{ label: '12-hour response guaranteed during business hours' },
	{ label: 'Flat-rate or milestone billing — no surprise invoices' },
	{ label: 'Full code ownership transferred on completion' },
] as const;
