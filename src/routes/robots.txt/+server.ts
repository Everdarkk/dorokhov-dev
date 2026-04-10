import { env } from '$env/dynamic/public';
import type { RequestHandler } from './$types';

const FALLBACK_SITE_URL = 'https://od.business';

export const prerender = true;

export const GET: RequestHandler = () => {
	const siteUrl = (env.PUBLIC_SITE_URL || FALLBACK_SITE_URL).replace(/\/$/, '');

	const body = [
		'User-agent: *',
		'Allow: /',
		'',
		`Sitemap: ${siteUrl}/sitemap.xml`,
		`Host: ${siteUrl}`
	].join('\n');

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
