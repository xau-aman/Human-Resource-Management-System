import React from 'react';
import { Users, Clock, CalendarOff, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from 'recharts';
import { StatCard, Card, Avatar, Badge } from '../../components/ui';
import {
  getDashboardStats, getAttendanceChartData, getDepartmentDistribution,
  getPerformanceTrend, getRecentActivity, getUpcomingLeaves,
} from '../../services/dashboard.service';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#14b8a6'];

const leaveTypeBadge: Record<string, 'blue' | 'red' | 'green' | 'gray'> = {
  SICK: 'red', CASUAL: 'blue', PAID: 'green', UNPAID: 'gray',
};

export default function DashboardPage() {
  const stats = getDashboardStats();
  const attendanceData = getAttendanceChartData();
  const deptData = getDepartmentDistribution();
  const perfTrend = getPerformanceTrend();
  const activity = getRecentActivity();
  const upcomingLeaves = getUpcomingLeaves();

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Employees" value={stats.totalEmployees} icon={<Users size={18} />} trend={{ value: 9, label: 'vs last month' }} />
        <StatCard title="Present Today" value={stats.presentToday} icon={<Clock size={18} />} iconColor="bg-emerald-50 text-emerald-600" trend={{ value: 5, label: 'vs yesterday' }} />
        <StatCard title="On Leave" value={stats.onLeave} icon={<CalendarOff size={18} />} iconColor="bg-amber-50 text-amber-600" />
        <StatCard title="Avg Performance" value={`${stats.avgPerformance}%`} icon={<TrendingUp size={18} />} iconColor="bg-purple-50 text-purple-600" trend={{ value: 3, label: 'vs last quarter' }} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <p className="text-sm font-semibold text-gray-800 mb-4">Attendance Overview</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={attendanceData} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="present" fill="#6366f1" radius={[4, 4, 0, 0]} name="Present" />
              <Bar dataKey="late" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Late" />
              <Bar dataKey="absent" fill="#ef4444" radius={[4, 4, 0, 0]} name="Absent" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <p className="text-sm font-semibold text-gray-800 mb-4">Department Distribution</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={deptData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                {deptData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2">
            {deptData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-xs text-gray-500">{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Performance trend */}
      <Card>
        <p className="text-sm font-semibold text-gray-800 mb-4">Performance Trend</p>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={perfTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis domain={[60, 100]} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} dot={{ r: 4, fill: '#6366f1' }} name="Avg Score" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <p className="text-sm font-semibold text-gray-800 mb-4">Recent Activity</p>
          <div className="space-y-3">
            {activity.map(a => (
              <div key={a.id} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-700">{a.message}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <p className="text-sm font-semibold text-gray-800 mb-4">Upcoming Leave Requests</p>
          <div className="space-y-3">
            {upcomingLeaves.map(l => (
              <div key={l.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Avatar name={`${l.employee.firstName} ${l.employee.lastName}`} size="sm" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{l.employee.firstName} {l.employee.lastName}</p>
                    <p className="text-xs text-gray-400">{l.startDate} → {l.endDate}</p>
                  </div>
                </div>
                <Badge variant={leaveTypeBadge[l.leaveType] ?? 'gray'}>{l.leaveType}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
