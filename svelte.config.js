import nodeAdapter from '@sveltejs/adapter-node';
import vercelAdapter from '@sveltejs/adapter-vercel';

const isVercelBuild = process.env.VERCEL === '1' || process.env.VERCEL === 'true';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: isVercelBuild
			? vercelAdapter({ output: 'server', split: true })
			: nodeAdapter()
	}
};

export default config;
