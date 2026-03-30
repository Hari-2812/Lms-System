import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

import authRoutes from './routes/authRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import jobRoutes from './routes/jobRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch(err => console.log(err));

app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/jobs', jobRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));