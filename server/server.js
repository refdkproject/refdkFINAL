import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
// Admin Routes
import adminEventRoutes from './routes/adminRoutes/eventRoutes.js';
import adminTrainingRoutes from './routes/adminRoutes/trainingRoutes.js';
import adminWishlistRoutes from './routes/adminRoutes/wishlistRoutes.js';
import adminInstitutionEngagementRoutes from './routes/adminRoutes/institutionEngagementRoutes.js';
import adminInstitutionRoutes from './routes/adminRoutes/institutionRoutes.js';
// User Routes
import userRoutes from './routes/userRoutes.js';
import emailRoutes from './routes/emailRoutes.js';
import trainingRoutes from './routes/trainingRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import institutionEngagement from './routes/institutionEngagementRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import institutionRoutes from './routes/institutionRoutes.js';

import newsFeedRoutes from './routes/newsFeedRoutes.js';

import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import connectDB from './config/db.js';

import http from 'http';
import { initSocket } from './socket.js';

dotenv.config();

// connect to Mongo DB
connectDB();

const PORT = process.env.PORT || 5036;
const app = express();
const server = http.createServer(app);

// Initialize socket with the server instance
initSocket(server);


app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// Serve uploaded files
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use('/news-feed', newsFeedRoutes);

// Admin Routes
app.use('/admin/wishlist', adminWishlistRoutes);
app.use('/admin/training', adminTrainingRoutes);
app.use('/admin/event', adminEventRoutes);
app.use('/admin/institution-engagements', adminInstitutionEngagementRoutes);
app.use('/admin/institutions', adminInstitutionRoutes);

// User Routes
app.use('/api/chat', chatRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/training', trainingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/event', eventRoutes);
app.use('/api/institutions', institutionRoutes);
app.use('/api/institution-engagements', institutionEngagement);

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use(notFound);
app.use(errorHandler);

server.listen(PORT, () => {
  console.log('App listening on port ' + PORT);
});
