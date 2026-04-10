# OD.BUSINESS // Portfolio Platform

<div align="center">

**Cyber-inspired personal brand platform built with SvelteKit 2 + Svelte 5**  
Fast, SEO-structured, animation-rich, and production-focused.

![SvelteKit](https://img.shields.io/badge/SvelteKit-2.x-ff3e00?style=for-the-badge&logo=svelte)
![Svelte](https://img.shields.io/badge/Svelte-5.x-f1413d?style=for-the-badge&logo=svelte)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.x-646cff?style=for-the-badge&logo=vite&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-4.x-6e9f18?style=for-the-badge&logo=vitest&logoColor=white)

</div>

---

## // Overview

This repository powers **od.business**, a high-performance developer portfolio focused on:

- clear conversion paths (project inquiry CTA + server-side contact API)
- cinematic visual identity (neon/cyber styling, animated backgrounds, custom cursor)
- strong technical trust signals (typed architecture, validation-heavy backend, tests)
- SEO and discoverability (canonical tags, Open Graph, JSON-LD, sitemap/robots routes)

The app is intentionally structured as a **content-driven marketing surface** with reusable section modules and constant-based copy/data sources.

---

## // Live Surface

### Public routes

- `/` : landing + services + process + FAQ + testimonials + CTA
- `/profile` : personal profile, expertise, approach, profile-specific CTA
- `/deploys` : shipped projects showcase with video previews
- `/api/contact` : secure server endpoint for contact submissions

### Layout composition

Global layout includes:

- persistent navigation + footer
- dynamic canonical/OG defaults
- runtime-gated custom cursor (enabled only for fine pointers and non-reduced-motion users)

---

## // Feature Matrix

| Domain | What is implemented |
| --- | --- |
| UI System | Modular Svelte components in `src/lib/components` (`sections`, `layout`, `common`, `backgrounds`) |
| Motion | Scroll reveal action, typewriter stream logic, animation helpers, reduced-motion guards |
| Content | Constants-driven sections (`hero`, `faq`, `work-process`, `recent-launches`, etc.) |
| Contact Funnel | Modal-based inquiry flow wired to server-side validation and SMTP dispatch |
| Security | Origin checks, AJAX header check, strict content-type, anti-bot guards, rate limiting |
| SEO | Per-page head metadata, canonical URLs, OG/Twitter cards, structured data JSON-LD |
| Deployability | Adapter switch: Node locally, Vercel adapter in Vercel build env |
| QA | Unit tests for server contact logic + browser component smoke specs |

---

## // Architecture

```text
src/
	routes/
		+layout.svelte        # Global shell (navigation/footer/cursor + metadata defaults)
		+layout.ts            # Site URL load and prerender/trailing-slash policy
		+page.svelte          # Main landing page composition
		deploys/+page.svelte  # Project archive page
		profile/+page.svelte  # Profile page
		api/contact/+server.ts# Contact HTTP handler (thin, secure, typed)

	lib/
		components/
			sections/           # Hero, FAQ, CTA, launches, etc.
			backgrounds/        # Canvas/visual atmosphere modules
			layout/             # Navigation, footer, cursor
			common/             # Shared controls (e.g., CyberButton)
		constants/            # Copy + structured section data
		actions/              # Reusable Svelte actions (e.g., scroll reveal)
		stores/               # Motion/reduced-motion state
		utils/                # Typewriter, easing, animation loop utilities
		server/contact.ts     # Business logic for validation, rate limit, email
```

Design principle: **thin route handlers, isolated business logic, reusable section modules**.

---

## // Contact API Pipeline

`POST /api/contact` delegates business logic to `src/lib/server/contact.ts` and applies layered defenses.

### Request guard flow

1. Origin validation (`ALLOWED_ORIGINS` + same-origin fallback)
2. `X-Requested-With: XMLHttpRequest` enforcement
3. `application/json` content-type guard
4. Payload parsing and type coercion
5. Per-IP rate limiting
6. Honeypot + fill-time anti-bot checks
7. Field validation + sanitization
8. Nodemailer SMTP dispatch (text + HTML templates)

### Validation highlights

- strict service and budget enum whitelists
- message minimum length + spam keyword/pattern checks
- HTML/control-character stripping in sanitized output
- fail-fast SMTP timeouts for serverless resilience

---

## // SEO + Metadata Strategy

Each major route defines:

- page-specific `<title>` and description
- canonical URL using loaded `siteUrl`
- Open Graph + Twitter image/meta
- JSON-LD schema (`WebSite`, `ProfilePage`, `CollectionPage`, and root `Person` entity)

Additional discoverability endpoints:

- `/robots.txt`
- `/sitemap.xml`

---

## // Security Posture

Platform-level response headers are configured in `vercel.json`, including:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Strict-Transport-Security`
- `Cross-Origin-Opener-Policy: same-origin`
- restrictive `Content-Security-Policy`

Static caching policies are also tuned for immutable assets, fonts, and public metadata files.

---

## // Tech Stack

### Core

- Svelte 5
- SvelteKit 2
- TypeScript 5
- Vite 7

### Backend + Infra

- Nodemailer (SMTP delivery)
- Adapter strategy: `@sveltejs/adapter-node` + `@sveltejs/adapter-vercel`
- Vercel deployment target

### DX + Quality

- ESLint 9 + eslint-plugin-svelte
- svelte-check
- Vitest 4 (+ Playwright browser mode)

---

## // Local Development

### Requirements

- Node.js `>= 20`
- npm

### Install

```bash
npm ci
```

### Start dev server

```bash
npm run dev
```

### Build + preview

```bash
npm run build
npm run preview
```

### Quality checks

```bash
npm run check
npm run lint
npm run test
```

---

## // Testing Snapshot

Current test surface includes:

- **server unit tests** for sanitization, payload validation, and rate-limit behavior (`contact.spec.ts`)
- **browser-render tests** for key route components (`+page.svelte` and profile page)

This gives confidence in backend form-hardening logic and core rendering paths.

---

## // Deployment

### Vercel

```bash
npm run deploy:preview
npm run deploy:prod
```

`svelte.config.js` automatically switches adapters based on Vercel environment flags, enabling smooth local Node workflows and production-ready Vercel output.

---

## // Notes

- This codebase is optimized for a **brand-forward portfolio** where visual direction and reliability both matter.
- Content is intentionally centralized in constants so copy and showcased projects can be updated quickly without rewriting section logic.
- The contact funnel is engineered with production safeguards, not just frontend validation.

---

<div align="center">

**OD.BUSINESS**  
Build fast. Ship clean. Stay true.

</div>
