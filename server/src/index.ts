import express from 'express';
import cors from 'cors';
import { config } from './config/env';
import { getFirebaseAdmin } from './config/firebase';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';

import authRoutes from './routes/auth.routes';
import employeeRoutes from './routes/employee.routes';
import attendanceRoutes from './routes/attendance.routes';
import leaveRoutes from './routes/leave.routes';
import performanceRoutes from './routes/performance.routes';
import skillsRoutes from './routes/skills.routes';
import analyticsRoutes from './routes/analytics.routes';
import insightsRoutes from './routes/insights.routes';
import exportRoutes from './routes/export.routes';
import payslipRoutes from './routes/payslip.routes';
import salaryRoutes from './routes/salary.routes';

// Initialize Firebase Admin
getFirebaseAdmin();

const app = express();

app.use(cors({ origin: (origin, cb) => { if (!origin || origin.startsWith('http://localhost') || origin.endsWith('.vercel.app')) cb(null, true); else cb(new Error('Not allowed by CORS')); }, credentials: true }));
app.use(express.json());
app.use(requestLogger);

app.get('/api/v1/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), environment: config.nodeEnv });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/employees', employeeRoutes);
app.use('/api/v1/attendance', attendanceRoutes);
app.use('/api/v1/leaves', leaveRoutes);
app.use('/api/v1/performance', performanceRoutes);
app.use('/api/v1/skills', skillsRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/insights', insightsRoutes);
app.use('/api/v1/export', exportRoutes);
app.use('/api/v1/payslip', payslipRoutes);
app.use('/api/v1/employees', salaryRoutes); // salary sub-routes under /employees/:id/salary

// 404 handler for API routes
app.use('/api', (_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found', data: null, timestamp: new Date().toISOString() });
});

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`🚀 WorkZen API running on port ${config.port} [${config.nodeEnv}]`);
  if (config.gemini.apiKey) console.log('✅ Gemini AI connected');
  else console.log('⚠️  Gemini API key not set — using mock AI responses');
});

export default app;
