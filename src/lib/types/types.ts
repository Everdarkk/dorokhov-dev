import type { AccentColor } from '$lib/config/colors';

export type { AccentColor } from '$lib/config/colors';
export type { Breakpoint }  from '$lib/config/breakpoints';

// ─── Navigation ───────────────────────────────────────────────────────────────

export interface MenuItem {
id: number;
label: string;
href: '/profile' | '/deploys';
icon: 'profile' | 'deploys';
}

// ─── Interaction / Actions ────────────────────────────────────────────────────

export type ButtonAction = 'contact' | 'learn-more' | 'scroll' | 'external-link';

export interface ActionButton {
id: string;
label: string;
action: ButtonAction;
href?: string;
target?: '_blank' | '_self' | '_parent' | '_top';
className?: string;
}

// ─── Hero / Stream ────────────────────────────────────────────────────────────

export interface DataStreamLine {
id: number;
text: string;
delay: number;
opacity: number;
}

export interface HeroConfig {
navigationHeight: number;
showImage: boolean;
showButtons: boolean;
columnsLayout: 'single' | 'two-column';
maxWidth: number;
}

export interface DeviceCapabilities {
isMobile: boolean;
isTablet: boolean;
isLowPowerDevice: boolean;
screenHeight: number;
screenWidth: number;
}

// ─── Marquee ──────────────────────────────────────────────────────────────────

export interface MarqueeItem {
id: string;
label: string;
icon: string;
color: AccentColor;
}

// ─── Projects / Launches ─────────────────────────────────────────────────────

export interface ProjectKey { label: string; value: string; }

export interface Project {
id: string;
index: string;
name: string;
tag: string;
year: string;
url: string;
color: AccentColor;
description: string;
keys: ProjectKey[];
videoUrl: string;
videoPoster: string;
}

// ─── Case Study ───────────────────────────────────────────────────────────────

export interface CaseStudyMetric {
id: string;
label: string;
sublabel: string;
before: string;
endValue: number;
format: (n: number) => string;
color: string;
}

export type CaseStudyMetaItem = [string, string];

export interface CaseStudyData {
metrics: CaseStudyMetric[];
tech: string[];
meta: CaseStudyMetaItem[];
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

export interface FaqItem {
id: string;
command: string;
question: string;
answerLines: string[];
accent: AccentColor;
pid: string;
}

// ─── Key Services ─────────────────────────────────────────────────────────────

export interface ServiceBenefit { label: string; value: string; }
export interface ServiceTool    { name: string; tag: string; }

export interface Service {
id: string;
index: number;
layout: 'text-visual' | 'visual-text';
accent: AccentColor;
code: string;
title: string;
tagline: string;
description: string;
benefits: ServiceBenefit[];
tools: ServiceTool[];
icon: string;
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

export interface TestimonialMetric {
before: string;
beforeLabel: string;
after: string;
afterLabel: string;
counterTarget: number;
}

export interface Testimonial {
id: string;
name: string;
role: string;
company: string;
initials: string;
review: string;
accent: AccentColor;
year: string;
metric?: TestimonialMetric;
}

// ─── Value Proposition ────────────────────────────────────────────────────────

export interface ValuePropCard {
id: string;
title: string;
description: string;
icon: string;
accentColor: AccentColor;
}

// ─── Work Process ─────────────────────────────────────────────────────────────

export interface WorkStep {
id: string;
index: number;
title: string;
subtitle: string;
description: string;
processCode: string;
accentColor: AccentColor;
icon: string;
tools: string[];
}
