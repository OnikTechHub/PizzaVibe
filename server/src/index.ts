import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import inventoryRoutes from './routes/inventory.routes.js';
import pizzaRoutes from './routes/pizza.routes.js';
import orderRoutes from './routes/order.routes.js';
import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// Middlewares
app.use(
  cors({
    origin: [CLIENT_URL, 'http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Root Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'PizzaVibe API',
    version: '1.0.0',
    developer: 'Onik Das',
    project: 'OIBSIP Level 3 Task 1',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/pizzas', pizzaRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Global 404 Handler for undefined API routes
app.use('/api/*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `API route ${req.originalUrl} not found`,
  });
});

// Global Error Handler
app.use((err: unknown, _req: Request, res: Response, _next: express.NextFunction) => {
  console.error('[PizzaVibe Error Handler]:', err);
  const message = err instanceof Error ? err.message : 'Internal Server Error';
  res.status(500).json({ success: false, message });
});

// Initialize database and start HTTP server
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log('====================================================');
    console.log(`🍕 PizzaVibe Artisan Platform Server`);
    console.log(`   Status: Online & Ready`);
    console.log(`   Port: ${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`   Developer: Onik Das (OIBSIP Level 3 Task 1)`);
    console.log(`   Health Check: http://localhost:${PORT}/api/health`);
    console.log('====================================================');
  });
};

startServer();

export default app;
