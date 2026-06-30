import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const today = new Date().toISOString().split('T')[0];

const urls = [
  { loc: '/',                    changefreq: 'daily',   priority: '1.0',  lastmod: today },
  { loc: '/unlisted-space',      changefreq: 'weekly',  priority: '0.9',  lastmod: today },
  { loc: '/open-account',        changefreq: 'monthly', priority: '0.9',  lastmod: today },
  { loc: '/fno',                 changefreq: 'daily',   priority: '0.9',  lastmod: today },
  { loc: '/services',            changefreq: 'weekly',  priority: '0.85', lastmod: today },
  { loc: '/depository-services', changefreq: 'weekly',  priority: '0.85', lastmod: today },
  { loc: '/about',               changefreq: 'monthly', priority: '0.8',  lastmod: today },
  { loc: '/screener',            changefreq: 'daily',   priority: '0.8',  lastmod: today },
  { loc: '/learn',               changefreq: 'weekly',  priority: '0.8',  lastmod: today },
  { loc: '/learn/recommendations', changefreq: 'daily', priority: '0.8',  lastmod: today },
  { loc: '/52-week-tracker',     changefreq: 'daily',   priority: '0.8',  lastmod: today },
  { loc: '/compare',             changefreq: 'weekly',  priority: '0.7',  lastmod: today },
  { loc: '/products',            changefreq: 'monthly', priority: '0.7',  lastmod: today },
  { loc: '/brokerage-calculator', changefreq: 'monthly', priority: '0.7', lastmod: today },
  { loc: '/margin-calculator',   changefreq: 'monthly', priority: '0.7',  lastmod: today },
  { loc: '/contact',             changefreq: 'monthly', priority: '0.7',  lastmod: today },
  { loc: '/team',                changefreq: 'monthly', priority: '0.6',  lastmod: today },
  { loc: '/holidays',            changefreq: 'monthly', priority: '0.6',  lastmod: today },
  { loc: '/careers',             changefreq: 'monthly', priority: '0.5',  lastmod: today },
  { loc: '/privacy-policy',      changefreq: 'yearly',  priority: '0.3',  lastmod: '2026-01-01' },
  { loc: '/cookie-policy',       changefreq: 'yearly',  priority: '0.3',  lastmod: '2026-01-01' },
];

const BASE = 'https://www.sphpnp.com';

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${BASE}${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

const out = path.resolve(__dirname, '../public/sitemap.xml');
fs.writeFileSync(out, xml);
console.log(`Sitemap generated with lastmod=${today} for ${urls.length} URLs.`);
