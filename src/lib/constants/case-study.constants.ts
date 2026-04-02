export type CaseStudyMetric = {
	id: string;
	label: string;
	sublabel: string;
	before: string;
	endValue: number;
	format: (n: number) => string;
	color: string;
};

export type CaseStudyMetaItem = [string, string];

export type CaseStudyData = {
	metrics: CaseStudyMetric[];
	tech: string[];
	meta: CaseStudyMetaItem[];
};

export const TERNO_TOP_DATA: CaseStudyData = {
	metrics: [
		{
			id: 'conversion',
			label: 'Conversion Rate',
			sublabel: 'First month result',
			before: '~1%',
			endValue: 15,
			format: (n) => `+${n}%`,
			color: 'var(--cp-lime, #00ff88)'
		},
		{
			id: 'views',
			label: 'Monthly Views',
			sublabel: '6-month growth',
			before: '400',
			endValue: 4200,
			format: (n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}K+` : String(n)),
			color: 'var(--cp-cyan, #00f5ff)'
		},
		{
			id: 'pagespeed',
			label: 'PageSpeed Score',
			sublabel: 'Google Lighthouse',
			before: '58',
			endValue: 96,
			format: (n) => String(n),
			color: 'var(--cp-yellow, #ffe600)'
		},
		{
			id: 'organic',
			label: 'Organic Traffic',
			sublabel: 'Search growth',
			before: '—',
			endValue: 320,
			format: (n) => `+${n}%`,
			color: 'var(--cp-pink, #ff0055)'
		}
	],
	tech: ['Next.JS', 'TypeScript', 'Supabase', 'Google Maps', 'Nodemailer', 'Vercel'],
	meta: [
		['YEAR', '2026'],
		['COMMITS', '86+'],
		['TYPE', 'Local Biz']
	]
};
