import { env } from '$env/dynamic/public';
import type { LayoutLoad } from './$types';

const FALLBACK_SITE_URL = 'https://od.business';

export const prerender = true;
export const trailingSlash = 'never';

export const load: LayoutLoad = () => {
	const siteUrl = (env.PUBLIC_SITE_URL || FALLBACK_SITE_URL).replace(/\/$/, '');

	return {
		siteUrl
	};
};
