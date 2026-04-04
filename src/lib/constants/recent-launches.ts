import type { Project } from '$lib/types';
import adVideo from '$lib/assets/videos/ad.webm';
import adPoster from '$lib/assets/images/ad.webp';
import omVideo from '$lib/assets/videos/om.webm';
import omPoster from '$lib/assets/images/om.webp';
import tagaVideo from '$lib/assets/videos/taga.webm';
import tagaPoster from '$lib/assets/images/taga.webp';
import nnVideo from '$lib/assets/videos/nn.webm';
import nnPoster from '$lib/assets/images/nn.webp';
import ttVideo from '$lib/assets/videos/tt.webm';
import ttPoster from '$lib/assets/images/tt.webp';

export const PROJECTS: Project[] = [
  {
    id: 'proj-01',
    index: '01',
    name: 'Alina Dorokhova',
    tag: 'Personal Website',
    year: '2025',
    url: 'https://alinadorokhova.com',
    color: 'cyan',
    description:
      'A personal website built from scratch for a real client — designed in Figma and shipped solo in ~10 days. Features email contact via EmailJS, auto-generated sitemap for SEO, and smooth SVG asset rendering. Deployed on Vercel with a custom GoDaddy domain.',
    keys: [
      { label: 'Stack',    value: 'Next.js 15 · React 19 · TypeScript · Tailwind 4' },
      { label: 'Features', value: 'EmailJS · next-sitemap · SVG support' },
      { label: 'Shipped',  value: '~10 days · solo' },
      { label: 'Deploy',   value: 'Vercel · custom GoDaddy domain' },
    ],
    videoUrl: adVideo,
    videoPoster: adPoster,
  },
  {
    id: 'proj-02',
    index: '02',
    name: 'Oleksandr Moskin',
    tag: 'Artist Portfolio',
    year: '2025',
    url: 'https://oleksandr-moskin.vercel.app',
    color: 'pink',
    description:
      'A portfolio website for a modern Ukrainian artist, crafted with meticulous attention to visual detail across 73 commits. Framer Motion animations give the gallery a cinematic, immersive feel that complements the artwork.',
    keys: [
      { label: 'Stack',    value: 'Next.js 15 · React 19 · TypeScript · CSS' },
      { label: 'Anim',     value: 'Framer Motion · cinematic transitions' },
      { label: 'Scope',    value: 'Client project · 73 commits' },
      { label: 'Deploy',   value: 'Vercel' },
    ],
    videoUrl: omVideo,
    videoPoster: omPoster,
  },
  {
    id: 'proj-03',
    index: '03',
    name: 'TAGA Social',
    tag: 'Social Platform',
    year: '2025',
    url: 'https://taga-social.vercel.app',
    color: 'purple',
    description:
      'A minimalist full-stack social media platform where users post "echoes", filter by tags, mark favorites, and manage avatar profiles. Supabase powers auth, database, and file storage — with route-level middleware for access control.',
    keys: [
      { label: 'Stack',    value: 'Next.js · TypeScript · Supabase · Tailwind' },
      { label: 'Backend',  value: 'Supabase Auth · DB · Storage' },
      { label: 'UI',       value: 'shadcn/ui · Framer Motion' },
      { label: 'Features', value: 'Auth · Feed · Tags · Favorites · Avatars' },
    ],
    videoUrl: tagaVideo,
    videoPoster: tagaPoster,
  },
  {
    id: 'proj-04',
    index: '04',
    name: 'News AI',
    tag: 'AI / News App',
    year: '2025',
    url: 'https://news-personal-ai.vercel.app',
    color: 'yellow',
    description:
      'An AI-powered daily news reader that scrapes and parses articles using Readability and jsdom, then summarises them with Google Gemini 2.5. SWR handles client-side data fetching for a snappy, reactive experience.',
    keys: [
      { label: 'Stack',    value: 'Next.js 15 · TypeScript · Tailwind 4' },
      { label: 'AI',       value: 'Google Gemini 2.5 · streaming summaries' },
      { label: 'Parsing',  value: 'Readability · jsdom · web scraping' },
      { label: 'Data',     value: 'SWR · server-side API routes' },
    ],
    videoUrl: nnVideo,
    videoPoster: nnPoster,
  },
  {
    id: 'proj-05',
    index: '05',
    name: 'Terno-Top',
    tag: 'Local Business',
    year: '2026',
    url: 'https://terno-top.vercel.app',
    color: 'green',
    description:
      'A production client website for a Ternopil-based audience — the most actively maintained project with 86 commits. Integrates Google Maps for location features, Supabase SSR for data, and Nodemailer for server-side contact form handling.',
    keys: [
      { label: 'Stack',    value: 'Next.js 16 · React 19 · TypeScript' },
      { label: 'Backend',  value: 'Supabase SSR · Auth · Nodemailer' },
      { label: 'Maps',     value: 'Google Maps API · @vis.gl/react-google-maps' },
      { label: 'Scope',    value: 'Client project · 86 commits · live' },
    ],
    videoUrl: ttVideo,
    videoPoster: ttPoster,
  },
];

export const COLOR_MAP: Record<Project['color'], { primary: string; glow: string; border: string }> = {
		cyan:   { primary: 'var(--cp-cyan,   #00f5ff)', glow: 'rgba(0,245,255,0.18)',   border: 'rgba(0,245,255,0.35)'   },
		pink:   { primary: 'var(--cp-pink,   #ff0055)', glow: 'rgba(255,0,85,0.18)',    border: 'rgba(255,0,85,0.35)'    },
		purple: { primary: 'var(--cp-purple, #b300ff)', glow: 'rgba(179,0,255,0.18)',   border: 'rgba(179,0,255,0.35)'   },
		yellow: { primary: 'var(--cp-yellow, #ffe600)', glow: 'rgba(255,230,0,0.18)',   border: 'rgba(255,230,0,0.35)'   },
		green:  { primary: 'var(--cp-green,  #00ff88)', glow: 'rgba(0,255,136,0.18)',   border: 'rgba(0,255,136,0.35)'   },
	};