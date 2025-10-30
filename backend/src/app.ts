import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import passport from './config/passport';

// Routes
import authRoutes from './routes/auth.routes';
import accountRoutes from './routes/account.routes';
import botRoutes from './routes/bot.routes';
import conversationRoutes from './routes/conversation.routes';
import webhookRoutes from './routes/webhook.routes';
import analyticsRoutes from './routes/analytics.routes';

const app = express();

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Body parser - Webhooks doivent être traités avant le body parser général
app.use('/api/webhooks', express.json({ verify: (req, res, buf) => { (req as any).rawBody = buf; } }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Passport initialization
app.use(passport.initialize());

// Static files (uploads)
app.use('/uploads', express.static('uploads'));

// Redirect root domain to www (if accessed without www)
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    const host = req.get('host') || '';
    // If accessing root domain (without www) in production, redirect to www
    if (host === 'setyourcommunity.fun' && !host.startsWith('www.')) {
      return res.redirect(301, `https://www.setyourcommunity.fun${req.originalUrl}`);
    }
    next();
  });
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Import account controller for callbacks
import { 
  instagramCallback, 
  metaDeauthorize, 
  privacyDataDeletion,
  privacyDeletionStatus 
} from './controllers/account.controller';

// Public routes for Meta/Facebook callbacks
// IMPORTANT: Ces routes doivent accepter form-urlencoded (déjà configuré avec express.urlencoded)

// OAuth callback (GET avec query params)
app.get('/auth/meta/callback', instagramCallback);

// Deauthorization callback (POST avec form-urlencoded signed_request)
app.post('/auth/meta/deauthorize', metaDeauthorize);

// Privacy routes (RGPD compliance)
// Data deletion callback (POST avec form-urlencoded signed_request)
app.post('/privacy/delete', privacyDataDeletion);

// Deletion status page (publique, pour Meta review)
app.get('/privacy/deletion-status/:confirmationCode', privacyDeletionStatus);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/bot', botRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/analytics', analyticsRoutes);

// Root route - API info
app.get('/', (req, res) => {
  res.json({
    name: 'SetYourCommunity API',
    version: '1.0.0',
    status: 'running',
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      health: '/health',
      api: '/api',
      docs: 'See API documentation'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Erreur interne du serveur',
  });
});

export default app;

