require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
const messageService = require('./services/messageService');

const app = express();
const server = http.createServer(app);

// Connect to Database
connectDB();

// Middleware
app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173', credentials: true })); // Vite default port
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 5000, // higher limit in dev
  message: {
    success: false,
    message: 'Too many requests, please try again later.'
  }
});
app.use('/api/', apiLimiter);

// Routes
app.get('/api/health', (req, res) => res.json({ success: true, message: 'Server is running' }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/applications', require('./routes/applicationsGlobal'));
app.use('/api/workspaces', require('./routes/workspaces'));
app.use('/api/profiles', require('./routes/profiles'));
app.use('/api/submissions', require('./routes/submissions'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/ai', require('./routes/aiRoutes'));

// Error Handler
app.use(errorHandler);

// Socket.io Setup
const io = new Server(server, {
  cors: { origin: 'http://localhost:5173', credentials: true }
});
app.set('io', io);
global.io = io;

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Authentication required'));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error('Invalid token'));
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.user.id);
  socket.join(socket.user.id); // Join personal room for notifications
  
  socket.on('join_workspace', (workspaceId) => {
    socket.join(workspaceId);
    console.log(`User ${socket.user.id} joined workspace ${workspaceId}`);
  });
  
  socket.on('message:send', async ({ workspaceId, content, attachmentUrl }) => {
    try {
      const message = await messageService.createMessage(workspaceId, socket.user.id, content, attachmentUrl);
      io.to(workspaceId).emit('message:new', message);
    } catch (err) {
      console.error('Socket message error:', err.message);
    }
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.user.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
