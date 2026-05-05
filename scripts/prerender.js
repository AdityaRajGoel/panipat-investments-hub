import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.resolve(__dirname, '../dist');

// Define all routes we want to prerender (matching our sitemap)
const routes = [
  '/',
  '/about',
  '/services',
  '/unlisted-space',
  '/open-account',
  '/screener',
  '/fno',
  '/learn',
  '/learn/recommendations',
  '/52-week-tracker',
  '/compare',
  '/products',
  '/depository-services',
  '/brokerage-calculator',
  '/margin-calculator',
  '/team',
  '/contact',
  '/holidays',
  '/careers',
  '/privacy-policy',
  '/cookie-policy'
];

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
      // 2. Launch Puppeteer
      const browser = await puppeteer.launch({
        args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox'],
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      });

      for (const route of routes) {
        console.log(`Prerendering ${route}...`);
        const page = await browser.newPage();
        
        // Suppress console logs from the page
        page.on('console', () => {});
        
        await page.goto(`http://localhost:${port}${route}`, {
          waitUntil: 'networkidle0', // Wait until network is fully idle (all JS loaded)
          timeout: 30000,
        });

        // Get the fully rendered HTML
        const html = await page.content();
        
        // 3. Save to file
        let filePath = path.join(DIST_DIR, route);
        
        if (route === '/') {
          filePath = path.join(DIST_DIR, 'index.html');
        } else {
          // Create directory if it doesn't exist
          if (!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath, { recursive: true });
          }
          filePath = path.join(filePath, 'index.html');
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
