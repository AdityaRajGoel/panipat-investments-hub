import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.resolve(__dirname, '../dist');

// Article routes are derived from the content file rather than hardcoded. Since
// unmatched paths now return a real 404, an article present in learnContent.ts
// but missing here would hard-404 instead of quietly falling back to the SPA.
// Deriving the list makes that drift impossible.
const learnArticleSlugs = [
  ...new Set(
    Array.from(
      fs
        .readFileSync(path.resolve(__dirname, '../src/data/learnContent.ts'), 'utf-8')
        .matchAll(/slug:\s*"([a-z0-9-]+)"/g),
      (match) => match[1]
    )
  ),
];
const learnArticleRoutes = learnArticleSlugs.map((slug) => `/learn/${slug}`);

if (learnArticleSlugs.length === 0) {
  console.error('No article slugs found in learnContent.ts - refusing to prerender an incomplete site.');
  process.exit(1);
}

// Define all routes we want to prerender (matching our sitemap)
const routes = [
  '/',
  '/about',
  '/services',
  '/unlisted-space',
  '/open-account',
  '/pricing',
  '/screener',
  '/fno',
  '/learn',
  '/learn/recommendations',
  ...learnArticleRoutes,
  '/52-week-tracker',
  '/compare',
  '/products',
  '/depository-services',
  '/brokerage-calculator',
  '/margin-calculator',
  '/sip-calculator',
  '/team',
  '/contact',
  '/holidays',
  '/reports',
  '/careers',
  '/privacy-policy',
  '/cookie-policy',
  '/terms',
  '/disclaimer',
  '/investor-corner'
];

// Prerendered but deliberately absent from the sitemap. Vercel serves
// dist/404.html for any path matching no static file and no rewrite, replacing
// the old catch-all rewrite that answered every unknown URL with 200 + the
// homepage (a soft 404 that burns crawl budget). The route hits the React
// Router catch-all, so it renders NotFound -> SEOHead noindex and the file
// ships noindex,nofollow even if the status code ever regresses to 200.
const ERROR_ROUTE = '/404';

async function prerender() {
  console.log('Starting prerendering process...');

  // 1. Start a local static server to serve the built SPA
  const app = express();
  app.use(express.static(DIST_DIR));
  // Fallback for SPA routing
  app.use((req, res) => {
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });

  const server = app.listen(0, async () => {
    const port = server.address().port;
    console.log(`Static server running on port ${port}`);

    try {
      // 2. Launch Puppeteer dynamically based on environment
      let browser;
      if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_VERSION) {
        console.log('Running on Vercel/Lambda, using @sparticuz/chromium');
        const puppeteer = (await import('puppeteer-core')).default;
        const chromium = (await import('@sparticuz/chromium')).default;
        browser = await puppeteer.launch({
          args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox'],
          defaultViewport: chromium.defaultViewport,
          executablePath: await chromium.executablePath(),
          headless: chromium.headless,
        });
      } else {
        console.log('Running locally, using standard puppeteer');
        const puppeteer = (await import('puppeteer')).default;
        browser = await puppeteer.launch({
          headless: "new",
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
      }

      for (const route of [...routes, ERROR_ROUTE]) {
        console.log(`Prerendering ${route}...`);
        const page = await browser.newPage();

        // Suppress console logs from the page
        page.on('console', () => {});

        try {
          await page.goto(`http://localhost:${port}${route}`, {
            waitUntil: 'networkidle2', // More resilient than networkidle0
            timeout: 15000,
          });
        } catch (e) {
          console.warn(`Timeout or error on ${route}, proceeding to capture current DOM...`);
        }

        // Get the fully rendered HTML
        const html = await page.content();

        // 3. Save to file
        let filePath;

        if (route === '/') {
          filePath = path.join(DIST_DIR, 'index.html');
        } else {
          // e.g., '/about' -> 'about.html', '/learn/recommendations' -> 'learn/recommendations.html'
          const routePath = route.startsWith('/') ? route.substring(1) : route;
          filePath = path.join(DIST_DIR, `${routePath}.html`);

          // Create directory if it doesn't exist
          const dir = path.dirname(filePath);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
        }

        fs.writeFileSync(filePath, html);
        console.log(`Saved ${filePath}`);
        await page.close();
      }

      await browser.close();
      console.log('Prerendering completed successfully.');
    } catch (error) {
      console.error('Error during prerendering:', error);
      process.exit(1);
    } finally {
      server.close();
    }
  });
}

prerender();
