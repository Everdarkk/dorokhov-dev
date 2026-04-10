import { env } from '$env/dynamic/public';
import type { RequestHandler } from './$types';

const FALLBACK_SITE_URL = 'https://od.business';

const pages = ['/', '/profile', '/deploys'];

export const prerender = true;

export const GET: RequestHandler = () => {
	const siteUrl = (env.PUBLIC_SITE_URL || FALLBACK_SITE_URL).replace(/\/$/, '');
	const updatedAt = new Date().toISOString();

	const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
		.map((path) => `  <url>\n    <loc>${siteUrl}${path}</loc>\n    <lastmod>${updatedAt}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${path === '/' ? '1.0' : '0.8'}</priority>\n  </url>`)
		.join('\n')}\n</urlset>`;

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
