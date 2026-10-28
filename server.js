// Minimal static server for the Prep! prototype. No framework needed.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const PORT = Number(process.env.PORT) || 5173;
const HOST = process.env.HOST || '127.0.0.1';
const PUBLIC_DIR = path.join(__dirname, 'public');

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
  '.map': 'application/json',
};

// Clean URLs that match the sitemap.
const ROUTES = {
  '/': 'index.html',
  '/setup': 'setup.html',
  '/room': 'room.html',
  '/review': 'review.html',
  '/prep-note': 'prep-note.html',
};

function send(res, status, body, type = 'text/plain; charset=utf-8') {
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-cache' });
  res.end(body);
}

const server = http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Method not allowed');

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);
  } catch {
    return send(res, 400, 'Bad request');
  }

  const file = ROUTES[pathname] || pathname.replace(/^\/+/, '');
  const resolved = path.join(PUBLIC_DIR, file);
  if (!resolved.startsWith(PUBLIC_DIR)) return send(res, 403, 'Forbidden');

  fs.stat(resolved, (err, stat) => {
    if (err || !stat.isFile()) {
      return fs.readFile(path.join(PUBLIC_DIR, '404.html'), (e, page) =>
        send(res, 404, e ? 'Not found' : page, TYPES['.html']),
      );
    }
    res.writeHead(200, {
      'Content-Type': TYPES[path.extname(resolved).toLowerCase()] || 'application/octet-stream',
      'Content-Length': stat.size,
      'Cache-Control': 'no-cache',
    });
    if (req.method === 'HEAD') return res.end();
    fs.createReadStream(resolved).pipe(res);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`\n  Prep! is running at http://localhost:${PORT}\n`);
});
