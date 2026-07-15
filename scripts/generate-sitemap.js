import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const today = new Date().toISOString().split('T')[0];

const urls = [
  { loc: '/',                    changefreq: 'daily',   priority: '1.0',  lastmod: today },
  { loc: '/unlisted-space',      changefreq: 'weekly',  priority: '0.9',  lastmod: today },
  { loc: '/open-account',        changefreq: 'monthly', priority: '0.9',  lastmod: today },
  { loc: '/pricing',             changefreq: 'monthly', priority: '0.85', lastmod: today },
  { loc: '/fno',                 changefreq: 'daily',   priority: '0.9',  lastmod: today },
  { loc: '/services',            changefreq: 'weekly',  priority: '0.85', lastmod: today },
  { loc: '/depository-services', changefreq: 'weekly',  priority: '0.85', lastmod: today },
  { loc: '/about',               changefreq: 'monthly', priority: '0.8',  lastmod: today },
  { loc: '/screener',            changefreq: 'daily',   priority: '0.8',  lastmod: today },
  { loc: '/learn',               changefreq: 'weekly',  priority: '0.8',  lastmod: today },
  { loc: '/learn/recommendations', changefreq: 'daily', priority: '0.8',  lastmod: today },
  // Learning Center articles (original content)
  { loc: '/learn/demat-account',       changefreq: 'monthly', priority: '0.7', lastmod: today },
  { loc: '/learn/pe-ratio',            changefreq: 'monthly', priority: '0.7', lastmod: today },
  { loc: '/learn/sip-vs-lumpsum',      changefreq: 'monthly', priority: '0.7', lastmod: today },
  { loc: '/learn/power-of-compounding', changefreq: 'monthly', priority: '0.7', lastmod: today },
  { loc: '/learn/mutual-funds-guide',  changefreq: 'monthly', priority: '0.7', lastmod: today },
  { loc: '/learn/ipo-guide',           changefreq: 'monthly', priority: '0.7', lastmod: today },
  { loc: '/learn/full-service-vs-discount-broker',           changefreq: 'monthly', priority: '0.7', lastmod: today },
  { loc: '/learn/tax-on-share-market-income',           changefreq: 'monthly', priority: '0.7', lastmod: today },
  { loc: '/learn/how-to-buy-unlisted-shares',           changefreq: 'monthly', priority: '0.7', lastmod: today },
  { loc: '/learn/fno-basics',           changefreq: 'monthly', priority: '0.7', lastmod: today },
  { loc: '/learn/margin-trading-facility-mtf',           changefreq: 'monthly', priority: '0.7', lastmod: today },
  { loc: '/52-week-tracker',     changefreq: 'daily',   priority: '0.8',  lastmod: today },
  { loc: '/compare',             changefreq: 'weekly',  priority: '0.7',  lastmod: today },
  { loc: '/products',            changefreq: 'monthly', priority: '0.7',  lastmod: today },
  { loc: '/brokerage-calculator', changefreq: 'monthly', priority: '0.7', lastmod: today },
  { loc: '/margin-calculator',   changefreq: 'monthly', priority: '0.7',  lastmod: today },
  { loc: '/contact',             changefreq: 'monthly', priority: '0.7',  lastmod: today },
  { loc: '/team',                changefreq: 'monthly', priority: '0.6',  lastmod: today },
  { loc: '/holidays',            changefreq: 'monthly', priority: '0.6',  lastmod: today },
  { loc: '/reports',             changefreq: 'weekly',  priority: '0.7',  lastmod: today },
  { loc: '/careers',             changefreq: 'monthly', priority: '0.5',  lastmod: today },
  { loc: '/privacy-policy',      changefreq: 'yearly',  priority: '0.3',  lastmod: '2026-01-01' },
  { loc: '/cookie-policy',       changefreq: 'yearly',  priority: '0.3',  lastmod: '2026-01-01' },
  { loc: '/terms',               changefreq: 'yearly',  priority: '0.3',  lastmod: '2026-01-01' },
  { loc: '/disclaimer',          changefreq: 'yearly',  priority: '0.3',  lastmod: '2026-01-01' },
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

// Write to public/ (source of truth for next build) and dist/ (already-copied
// build output - Vite copies public/ into dist/ *before* this postbuild script
// runs, so dist/sitemap.xml must be written directly or the deploy ships stale dates).
fs.writeFileSync(path.resolve(__dirname, '../public/sitemap.xml'), xml);
const distDir = path.resolve(__dirname, '../dist');
if (fs.existsSync(distDir)) {
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), xml);
}
console.log(`Sitemap generated with lastmod=${today} for ${urls.length} URLs.`);
