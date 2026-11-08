// CommonJS entry point for cPanel/CloudLinux Passenger.
const { createServer } = require('node:http');
const { join } = require('node:path');
const { loadEnvConfig } = require('@next/env');

process.env.NODE_ENV = 'production';
process.env.DST_EMBEDDED_API = '1';
loadEnvConfig(__dirname, false);

async function start() {
  const next = (await import('next')).default;
  const web = next({ dev: false, dir: __dirname });
  await web.prepare();
  const { pathToFileURL } = require('node:url');
  const api = (await import(pathToFileURL(join(__dirname, 'server/src/app.js')).href)).default;
  const handle = web.getRequestHandler();

  const server = createServer(async (req, res) => {
    let pathname;
    try {
      pathname = decodeURIComponent((req.url || '/').split('?')[0]);
    } catch {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Bad request');
      return;
    }
    if (/^\/api(?:\/|$)/i.test(pathname) || pathname === '/sitemap.xml') {
      api(req, res);
      return;
    }

    try {
      await handle(req, res);
    } catch (error) {
      console.error('Next.js request failed:', error.message);
      if (!res.headersSent) res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal server error');
    }
  });

  server.once('error', (error) => {
    console.error('Could not start hosting server:', error.message);
    process.exit(1);
  });

  server.listen(process.env.PORT || 3000, () => {
    console.log('DST Deco production server ready');
  });
}

start().catch((error) => {
  console.error('Could not initialize hosting server:', error.message);
  process.exit(1);
});
