import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const PORT = process.env.PORT || 3000;

// Resolve the public folder relative to this file, not the terminal's folder.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// All assignment data is kept in this file.
const courses = [
  { id: 1, title: 'Introduction to Programming', credits: 5 },
  { id: 2, title: 'Web Programming', credits: 4 },
  { id: 3, title: 'Database Management Systems', credits: 5 }
];

let requestsServed = 0;

// Middleware 1: log every incoming request.
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
};

// Middleware 2: count every incoming request, including static files and 404s.
const requestCounter = (req, res, next) => {
  requestsServed += 1;
  next();
};

// Middleware must be registered before routes so every request is logged and counted.
app.use(requestLogger);
app.use(requestCounter);

// Serve browser files from the public directory.
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/hello', (req, res) => {
  res.type('text').send("Hello from Ceren's server");
});

app.get('/robots.txt', (req, res) => {
  res.type('text/plain').send('User-agent: *\nDisallow:');
});

app.get('/old-page', (req, res) => {
  res.redirect('/hello');
});

app.get('/api/courses', (req, res) => {
  res.json(courses);
});

app.get('/api/status', (req, res) => {
  res.json({
    status: 'running',
    nodeVersion: process.version,
    uptimeSeconds: Math.floor(process.uptime())
  });
});

app.get('/api/headers', (req, res) => {
  res.json({
    userAgent: req.get('User-Agent') || null,
    accept: req.get('Accept') || null
  });
});

app.post('/api/subscribe', (req, res) => {
  res.status(201).json({ subscribed: true });
});

app.get('/api/admin', (req, res) => {
  res.status(403).json({ error: 'Forbidden' });
});

app.get('/api/stats', (req, res) => {
  res.json({ requestsServed });
});

// Express 5-compatible 404 fallback. Keep it after all real routes.
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    res.status(404).json({ error: 'Not found' });
    return;
  }

  res.status(404).type('text').send('Page not found');
});

app.listen(PORT, () => {
  console.log(`Ceren's study programme server is running at http://localhost:${PORT}`);
});
