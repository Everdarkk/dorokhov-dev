# dorokhov-dev

Portfolio site built with SvelteKit and deployed on Vercel.

## Commands

- `npm run dev` starts the local dev server.
- `npm run check` runs Svelte and TypeScript diagnostics.
- `npm run lint` runs ESLint.
- `npm run test` runs the Vitest suite.
- `npm run build` builds the production bundle.

## Environment

Copy `.env.example` values into your Vercel project settings or a local `.env` file.

- `ALLOWED_ORIGINS` comma-separated allowed origins for the contact API.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `CONTACT_TO` configure mail delivery.

## Vercel notes

- The contact API depends on SMTP environment variables and rejects cross-origin requests by default.
- On Windows, `npm run build` can fail locally with an `EPERM` symlink error when `@sveltejs/adapter-vercel` writes `.vercel/output`. Enable Windows Developer Mode or run the production build in Vercel/Linux CI.
- Browser tests require Playwright browsers: run `npx playwright install chromium` before `npm run test`.
