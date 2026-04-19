import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import db, { seedDatabase } from './db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';

dotenv.config();
const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }
});

// Middleware
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      process.env.CLIENT_URL
    ].filter(Boolean);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make db available to routes
app.set('db', db);

// Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'ShopVerse API running' }));

// Socket.io — live group buy counter
io.on('connection', (socket) => {
  socket.on('join-product', (productId) => socket.join(productId));
  socket.on('group-buy-interest', ({ productId, count }) => {
    io.to(productId).emit('group-buy-update', { count });
  });
});

// Start server
const PORT = process.env.PORT || 5000;
seedDatabase();
httpServer.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

export { io };
