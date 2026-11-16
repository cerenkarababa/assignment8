
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const courses = [
  { id: 1, title: 'Introduction to Programming', credits: 5 },
  { id: 2, title: 'Web Programming', credits: 4 },
  { id: 3, title: 'Database Management Systems', credits: 5 }
];

let requestsServed = 0;

// Request Logger Middleware
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
};

// Request Counter Middleware
const requestCounter = (req, res, next) => {
  requestsServed++;
  next();
};

// Register middleware before routes
app.use(requestLogger);
app.use(requestCounter);

// Parse incoming JSON request bodies
app.use(express.json());

// Homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Hello
app.get('/hello', (req, res) => {
  res.type('text/plain').send("Hello from Ceren's server");
});

// Robots
app.get('/robots.txt', (req, res) => {
  res.type('text/plain').send('User-agent: *\nDisallow:');
});

// Redirect
app.get('/old-page', (req, res) => {
  res.redirect('/hello');
});

// Get all courses
app.get('/api/courses', (req, res) => {
  res.json(courses);
});

// Get a single course by ID
app.get('/api/courses/:id', (req, res) => {
  const courseId = Number(req.params.id);

  const course = courses.find((item) => item.id === courseId);

  if (!course) {
    return res.status(404).json({
      error: 'Course not found'
    });
  }

  res.json(course);
});

// Status
app.get('/api/status', (req, res) => {
  res.json({
    status: 'running',
    nodeVersion: process.version,
    uptimeSeconds: Math.floor(process.uptime())
  });
});

// Headers
app.get('/api/headers', (req, res) => {
  res.json({
    userAgent: req.get('User-Agent') || null,
    accept: req.get('Accept') || null
  });
});

// Subscribe with email validation
app.post('/api/subscribe', (req, res) => {
  const email = req.body?.email;

  if (typeof email !== 'string' || email.trim() === '') {
    return res.status(400).json({
      error: 'Email address is required.'
    });
  }

  const normalizedEmail = email.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(normalizedEmail)) {
    return res.status(400).json({
      error: 'Please provide a valid email address.'
    });
  }

  res.status(201).json({
    subscribed: true,
    email: normalizedEmail
  });
});

// Admin
app.get('/api/admin', (req, res) => {
  res.status(403).json({ error: 'Forbidden' });
});

// Stats
app.get('/api/stats', (req, res) => {
  res.json({ requestsServed });
});

// 404 Fallback - Always last among normal routes
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    res.status(404).json({ error: 'Not found' });
    return;
  }

  res.status(404).type('text/plain').send('Page not found');
});

// Central Error-Handling Middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);

  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.status || err.statusCode || 500;

  res.status(statusCode).json({
    error: statusCode >= 500
      ? 'Internal Server Error'
      : err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(
    `Ceren's study programme server is running at http://localhost:${PORT}`
  );
});
