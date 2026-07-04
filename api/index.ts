import express from 'express';
import cors from 'cors';
import { config } from '../server/src/config/env';
import { getFirebaseAdmin } from '../server/src/config/firebase';
import { errorHandler } from '../server/src/middleware/errorHandler';

import authRoutes from '../server/src/routes/auth.routes';
import employeeRoutes from '../server/src/routes/employee.routes';
import attendanceRoutes from '../server/src/routes/attendance.routes';
import leaveRoutes from '../server/src/routes/leave.routes';
import performanceRoutes from '../server/src/routes/performance.routes';
import skillsRoutes from '../server/src/routes/skills.routes';
import analyticsRoutes from '../server/src/routes/analytics.routes';
import insightsRoutes from '../server/src/routes/insights.routes';
import exportRoutes from '../server/src/routes/export.routes';
import payslipRoutes from '../server/src/routes/payslip.routes';

getFirebaseAdmin();

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

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

app.use('/api', (_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found', data: null, timestamp: new Date().toISOString() });
});

app.use(errorHandler);

export default app;
