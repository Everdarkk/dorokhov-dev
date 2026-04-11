import { env } from '$env/dynamic/public';
import type { RequestHandler } from './$types';

const FALLBACK_SITE_URL = 'https://od.business';

const pages: { path: string; lastmod: string; changefreq: string; priority: string }[] = [
	{ path: '/',        lastmod: '2026-01-10', changefreq: 'weekly',  priority: '1.0' },
	{ path: '/profile', lastmod: '2026-01-10', changefreq: 'monthly', priority: '0.8' },
	{ path: '/deploys', lastmod: '2026-01-10', changefreq: 'monthly', priority: '0.9' },
];

export const prerender = true;

export const GET: RequestHandler = () => {
	const siteUrl = (env.PUBLIC_SITE_URL || FALLBACK_SITE_URL).replace(/\/$/, '');

	const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
		.map((p) => `  <url>\n    <loc>${siteUrl}${p.path}</loc>\n    <lastmod>${p.lastmod}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`)
		.join('\n')}\n</urlset>`;

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
