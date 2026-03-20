import type { Breakpoint } from '$lib/constants/hero.constants';

/**
 * Data stream line interface for terminal-style text animation
 */
export interface DataStreamLine {
	id: number;
	text: string;
	delay: number;
	opacity: number;
}

/**
 * Hero section configuration
 */
export interface HeroConfig {
	navigationHeight: number; // Navigation height in rem/pixels
	showImage: boolean; // Show image on device
	showButtons: boolean; // Show action buttons
	columnsLayout: 'single' | 'two-column'; // Layout variation
	maxWidth: number; // Maximum width of content
}

/**
 * Device capability detection
 */
export interface DeviceCapabilities {
	isMobile: boolean;
	isTablet: boolean;
	isLowPowerDevice: boolean;
	screenHeight: number;
	screenWidth: number;
}

/**
 * Button action type
 */
export type ButtonAction = 'contact' | 'learn-more' | 'scroll' | 'external-link';

/**
 * Action button interface
 */
export interface ActionButton {
	id: string;
	label: string;
	action: ButtonAction;
	href?: string;
	target?: '_blank' | '_self' | '_parent' | '_top';
	className?: string;
}
