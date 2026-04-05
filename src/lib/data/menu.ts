import type { MenuItem } from '$lib/types';

export const menuItems: MenuItem[] = [
	{
		id: 1,
		label: 'Profile',
		href: '#profile',
		icon: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`
	},
	{
		id: 2,
		label: 'Deploys',
		href: '/deploys',
		icon: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L8.5 9h7L12 2z"/><path d="M8.5 9 4 17h16L15.5 9"/><line x1="12" y1="17" x2="12" y2="22"/><line x1="9" y1="22" x2="15" y2="22"/></svg>`
	}
];
