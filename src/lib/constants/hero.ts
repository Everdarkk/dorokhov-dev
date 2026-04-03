import type { ActionButton } from '$lib/types';

/**
 * Initial data stream messages displayed on hero section load
 */
export const DATA_STREAM_MESSAGES: string[] = [
	'> Initializing neural pathways...',
	'> Loading digital consciousness...',
	'> Connecting to mainframe...',
	'> Streaming consciousness data...',
	'> Compiling biographical matrix...',
	'> Configuring portfolio interface...',
	'> System ready for navigation...',
	'> > _'
];

/**
 * Random messages displayed periodically in the data stream
 */
export const RANDOM_MESSAGES: string[] = [
	'> Scanning portfolio assets...',
	'> Updating skill matrix...',
	'> Buffering experience data...',
	'> Refreshing project cache...',
	'> Syncing web presence...',
	'> > _'
];

/**
 * Action buttons in hero section
 */
export const ACTION_BUTTONS: ActionButton[] = [
	{
		id: 'contact-me',
		label: 'CONTACT.ME()',
		action: 'contact',
		className: 'contact-btn'
	},
	{
		id: 'learn-more',
		label: 'LEARN_MORE()',
		action: 'learn-more',
		className: 'learn-btn'
	}
];

/**
 * Maximum number of visible lines in the data stream window
 */
export const MAX_VISIBLE_LINES = 6;

/**
 * Interval between random messages in milliseconds
 */
export const MESSAGE_UPDATE_INTERVAL = 5000;

/**
 * Delay between initial messages in milliseconds
 */
export const INITIAL_MESSAGE_DELAY = 300;
