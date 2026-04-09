import type { MenuItem } from '$lib/types';

export const menuItems: MenuItem[] = [
	{
		id: 1,
		label: 'Profile',
		href: '/profile',
		icon: 'profile'
	},
	{
		id: 2,
		label: 'Deploys',
		href: '/deploys',
		icon: 'deploys'
	}
];
