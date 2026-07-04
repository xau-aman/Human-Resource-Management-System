import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid, LineChart, Line } from 'recharts';
import { calculateDepartmentPerformance, calculateAttendanceTrend, calculateEmployeeGrowth } from '../../services/analytics.service';
import { Card, PageHeader, LoadingState } from '../../components/ui';

// TODO[ANALYTICS]: Implement workforce analytics calculations

export default function AnalyticsPage() {
  const [deptPerf, setDeptPerf] = useState<{ department: string; avgScore: number; employeeCount: number }[]>([]);
  const [attendanceTrend, setAttendanceTrend] = useState<{ date: string; present: number; absent: number; late: number }[]>([]);
  const [growth, setGrowth] = useState<{ month: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([calculateDepartmentPerformance(), calculateAttendanceTrend(14), calculateEmployeeGrowth()])
      .then(([d, a, g]) => { setDeptPerf(d); setAttendanceTrend(a); setGrowth(g); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState />;

  return (
    <div>
      <PageHeader title="Analytics" description="Workforce insights and trends" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <p className="text-sm font-semibold text-gray-800 mb-4">Department Performance</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={deptPerf} layout="vertical" barSize={16}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="department" tick={{ fontSize: 11 }} width={110} />
              <Tooltip formatter={(v) => [`${v}%`, 'Avg Score']} />
              <Bar dataKey="avgScore" fill="#6366f1" radius={[0, 4, 4, 0]} name="Avg Score" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <p className="text-sm font-semibold text-gray-800 mb-4">Employee Growth</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={growth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4, fill: '#8b5cf6' }} name="Employees" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="lg:col-span-2">
          <p className="text-sm font-semibold text-gray-800 mb-4">Attendance Trends (Last 14 Days)</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={attendanceTrend}>
              <defs>
                <linearGradient id="present" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Area type="monotone" dataKey="present" stroke="#6366f1" fill="url(#present)" strokeWidth={2} name="Present" />
              <Area type="monotone" dataKey="absent" stroke="#ef4444" fill="none" strokeWidth={1.5} strokeDasharray="4 2" name="Absent" />
              <Area type="monotone" dataKey="late" stroke="#f59e0b" fill="none" strokeWidth={1.5} name="Late" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
