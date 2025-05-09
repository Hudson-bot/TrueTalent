// backend/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import resume from "./routes/resume.js";
import { fileURLToPath } from 'url';
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import path from 'path';
import scoring from "./routes/scoring.js";
import usersRouter from './routes/users.js';
import authRoutes from './routes/authRoutes.js';  

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));


app.get('/test-email', async (req, res) => {
  const { sendEmail } = require('./utils/emailSender');
  try {
    await sendEmail({
      email: 'your_real_email@example.com', // 👈 Test with your actual email
      subject: 'SMTP Test',
      message: 'This is a test email'
    });
    res.send('Email sent!');
  } catch (err) {
    console.error('SMTP Error:', err);
    res.status(500).send('Error: ' + err.message);
  }
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);
app.use('/api', resume);
app.use('/api', scoring);
app.use("/api/projects", projectRoutes);
app.use('/api/users', usersRouter);
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }) // Added options for compatibility
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
  });

export default app;
