import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from './+page.svelte';

describe('/profile/+page.svelte', () => {
	it('should render the profile heading', async () => {
		render(Page);

		const heading = page.getByRole('heading', {
			level: 1,
			name: /Oleksandr\s+Dorokhov\s+Full-Stack Developer/i,
		});

		await expect.element(heading).toBeInTheDocument();
	});
});