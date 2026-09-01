import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './server/routes/api';
import { syncFirebaseWithInitialData } from './server/seedFirebase';

const isProduction = process.env.NODE_ENV === 'production';
const PORT = 3000;

async function startServer() {
  const app = express();

  // Permissive CORS for authorized domains: musfiracream.qiffie09.workers.dev, musfirabeautycream.shop, Cloud Run preview, and localhost
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    const allowedOrigins = [
      'https://musfiracream.qiffie09.workers.dev',
      'http://musfiracream.qiffie09.workers.dev',
      'https://musfirabeautycream.shop',
      'https://www.musfirabeautycream.shop',
      'http://musfirabeautycream.shop',
      'http://www.musfirabeautycream.shop',
    ];

    if (origin) {
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.workers.dev') ||
        origin.endsWith('.shop') ||
        origin.endsWith('.run.app') ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1')
      ) {
        res.setHeader('Access-Control-Allow-Origin', origin);
      } else {
        res.setHeader('Access-Control-Allow-Origin', '*');
      }
    } else {
      res.setHeader('Access-Control-Allow-Origin', '*');
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    next();
  });

  // Parse JSON and form bodies
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // Run initial Firebase Firestore sync in background
  syncFirebaseWithInitialData().catch((err) => {
    console.warn('Firebase initial sync warning:', err);
  });

  // Static uploads directory
  const uploadsPath = path.join(process.cwd(), 'public', 'uploads');
  app.use('/uploads', express.static(uploadsPath));

  // Mount API endpoints
  app.use('/api', apiRouter);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString(), brand: 'MUSFIRA' });
  });

  if (!isProduction) {
    // Dynamic import of Vite for development middleware mode
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Musfira E-Commerce Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
