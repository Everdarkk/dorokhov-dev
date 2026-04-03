import type { FaqItem } from '$lib/types';
export type { FaqItem } from '$lib/types';

export const FAQ_TYPEWRITER_CONFIG = {
	/** Delay between each character in ms */
	charDelay:    22,
	/** Pause between lines in ms */
	lineDelay:   120,
	/** Pause before answer starts streaming (after "run" click) in ms */
	bootDelay:   280,
} as const;

// ─── FAQ content ──────────────────────────────────────────────────────────────

export const FAQ_ITEMS: FaqItem[] = [
	{
		id:       'what-do-you-build',
		pid:      'PID_0x01 // QUERY',
		accent:   'cyan',
		question: 'What exactly do you build?',
		command:  'query --scope services --format=verbose',
		answerLines: [
			'> Initialising service manifest...',
			'',
			'  Landing pages    — full-stack, CWV-optimised, launch-ready',
			'  SaaS dashboards  — data-dense UIs, real-time, role-based',
			'  Design systems   — Figma → code, component libraries',
			'  Web apps         — auth, databases, APIs, everything in between',
			'',
			'> All deliverables are production-grade. No half-finished prototypes.',
			'[OK] service manifest loaded. 4 service types found.',
		],
	},
	{
		id:       'how-long',
		pid:      'PID_0x02 // TIMELINE',
		accent:   'pink',
		question: 'How long does a project take?',
		command:  'estimate --type project --output timeline',
		answerLines: [
			'> Parsing project parameters...',
			'',
			'  Landing page     →  5–10 business days',
			'  SaaS dashboard   →  3–8 weeks (scope-dependent)',
			'  Design system    →  1–3 weeks',
			'  Full web app     →  negotiated per spec',
			'',
			'> Timelines start from brief approval, not first contact.',
			'> Rush delivery available — apply --flag=urgent for pricing.',
			'[OK] estimate compiled successfully.',
		],
	},
	{
		id:       'tech-stack',
		pid:      'PID_0x03 // STACK',
		accent:   'purple',
		question: 'What tech stack do you use?',
		command:  'list --registry stack --depth=2',
		answerLines: [
			'> Scanning installed modules...',
			'',
			'  frontend   SvelteKit · Next.js · TypeScript · TailwindCSS',
			'  backend    Node.js · Hono · tRPC · REST · WebSocket',
			'  database   PostgreSQL · Drizzle ORM · Redis',
			'  infra      Vercel · Docker · GitHub Actions · Sentry',
			'  design     Figma · Framer · Lottie · Motion',
			'',
			'> Stack is chosen per project — not forced onto every job.',
			'[OK] 5 layers resolved.',
		],
	},
	{
		id:       'process',
		pid:      'PID_0x04 // PROCESS',
		accent:   'yellow',
		question: 'What does the process look like?',
		command:  'exec --process workflow --verbose',
		answerLines: [
			'> Executing workflow diagram...',
			'',
			'  [1] Discovery     brief · goals · users · constraints',
			'  [2] Design        wireframes → hi-fi → prototype',
			'  [3] Development   code · tests · CI pipeline',
			'  [4] Launch        deploy · monitor · go-live support',
			'  [5] Support       retainer · iterations · scaling',
			'',
			'> Each phase has a sign-off checkpoint before proceeding.',
			'[OK] workflow loaded. 5 phases confirmed.',
		],
	},
	{
		id:       'revisions',
		pid:      'PID_0x05 // REVISIONS',
		accent:   'green',
		question: 'How many revisions are included?',
		command:  'query --policy revisions --scope contract',
		answerLines: [
			'> Loading contract policy...',
			'',
			'  Design phase     unlimited revision rounds',
			'  Development      2 structured revision cycles',
			'  Post-launch      covered under support retainer',
			'',
			'> Revisions ≠ scope changes. New features are scoped separately.',
			'> Clear briefs = fewer revision rounds = faster delivery.',
			'[OK] policy loaded. no hard cap on design revisions.',
		],
	},
	{
		id:       'contact',
		pid:      'PID_0x06 // CONTACT',
		accent:   'cyan',
		question: 'How do I get started?',
		command:  'connect --target client --mode initiate',
		answerLines: [
			'> Opening communication channel...',
			'',
			'  Preferred   email · Telegram · LinkedIn',
			'  Response    within 24 h on business days',
			'  First step  15-min discovery call (free)',
			'',
			'> Send a brief message: project type, rough timeline, budget range.',
			'> The more context you share, the better I can assess fit.',
			'[OK] channel open. ready to receive transmission.',
		],
	},
];