import React, { useEffect, useState } from 'react';
import { Users, Clock, CalendarOff, TrendingUp, Sparkles, CheckCircle, AlertTriangle, BarChart2, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from 'recharts';
import { StatCard, Card, Avatar, Badge, LoadingState } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { getDashboardStats, getAttendanceChartData, getDepartmentDistribution, getPerformanceTrend, getRecentActivity, getUpcomingLeaves } from '../../services/dashboard.service';
import { getMyAttendance, clockIn, clockOut } from '../../services/attendance.service';
import { getMyLeaves } from '../../services/leave.service';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#14b8a6'];

// ─── Admin Dashboard ───────────────────────────────────────────────────────
function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [deptData, setDeptData] = useState<any[]>([]);
  const [perfTrend, setPerfTrend] = useState<any[]>([]);
  const [upcomingLeaves, setUpcomingLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDashboardStats(), getAttendanceChartData(), getDepartmentDistribution(), getPerformanceTrend(), getUpcomingLeaves()])
      .then(([s, a, d, p, l]) => { setStats(s); setAttendanceData(a); setDeptData(d); setPerfTrend(p); setUpcomingLeaves(l); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState />;

  const activity = getRecentActivity();

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Employees" value={stats?.totalEmployees ?? 0} icon={<Users size={16} />} iconBg="bg-indigo-500" />
        <StatCard title="Present Today" value={stats?.presentToday ?? 0} icon={<Clock size={16} />} iconBg="bg-emerald-500" />
        <StatCard title="On Leave" value={stats?.onLeave ?? 0} icon={<CalendarOff size={16} />} iconBg="bg-amber-500" />
        <StatCard title="Pending Leaves" value={upcomingLeaves.length} icon={<AlertTriangle size={16} />} iconBg="bg-violet-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <p className="text-sm font-bold text-white/90 mb-4">Attendance Trend</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={attendanceData} barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', background: 'rgba(15,20,35,0.95)', color: '#fff' }} />
              <Bar dataKey="present" fill="#6366f1" radius={[6, 6, 0, 0]} name="Present" />
              <Bar dataKey="late" fill="#f59e0b" radius={[6, 6, 0, 0]} name="Late" />
              <Bar dataKey="absent" fill="#ef4444" radius={[6, 6, 0, 0]} name="Absent" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <p className="text-sm font-bold text-white/90 mb-4">Departments</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={deptData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={4}>
                {deptData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', background: 'rgba(15,20,35,0.95)', color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {deptData.map((d, i) => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-xs text-gray-400">{d.name}</span>
                </div>
                <span className="text-xs font-semibold text-white/80">{d.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <p className="text-sm font-bold text-white/90 mb-4">Pending Leave Requests</p>
          <div className="space-y-3">
            {upcomingLeaves.length === 0 && <p className="text-sm text-gray-500">No pending requests</p>}
            {upcomingLeaves.map((l: any) => (
              <div key={l.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Avatar name={`${l.employee.firstName} ${l.employee.lastName}`} size="sm" />
                  <div>
                    <p className="text-sm font-medium text-white/80">{l.employee.firstName} {l.employee.lastName}</p>
                    <p className="text-xs text-gray-500">{l.startDate?.slice(0, 10)} → {l.endDate?.slice(0, 10)}</p>
                  </div>
                </div>
                <Badge variant="yellow">{l.leaveType}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <p className="text-sm font-bold text-white/90 mb-4">Recent Activity</p>
          <div className="space-y-3">
            {activity.map(a => (
              <div key={a.id} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-300">{a.message}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── HR Dashboard ──────────────────────────────────────────────────────────
function HRDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [pendingLeaves, setPendingLeaves] = useState<any[]>([]);
  const [deptData, setDeptData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDashboardStats(), getUpcomingLeaves(), getDepartmentDistribution()])
      .then(([s, l, d]) => { setStats(s); setPendingLeaves(l); setDeptData(d); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Employees" value={stats?.totalEmployees ?? 0} icon={<Users size={16} />} iconBg="bg-indigo-500" />
        <StatCard title="Pending Leaves" value={pendingLeaves.length} icon={<CalendarOff size={16} />} iconBg="bg-amber-500" />
        <StatCard title="Present Today" value={stats?.presentToday ?? 0} icon={<CheckCircle size={16} />} iconBg="bg-emerald-500" />
        <StatCard title="On Leave" value={stats?.onLeave ?? 0} icon={<AlertTriangle size={16} />} iconBg="bg-rose-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <p className="text-sm font-bold text-white/90 mb-4">Pending Leave Requests</p>
          <div className="space-y-3">
            {pendingLeaves.length === 0 && <p className="text-sm text-gray-500">No pending requests</p>}
            {pendingLeaves.map((l: any) => (
              <div key={l.id} className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/5">
                <div className="flex items-center gap-2.5">
                  <Avatar name={`${l.employee.firstName} ${l.employee.lastName}`} size="sm" />
                  <div>
                    <p className="text-sm font-medium text-white/80">{l.employee.firstName} {l.employee.lastName}</p>
                    <p className="text-xs text-gray-500">{l.startDate?.slice(0, 10)} → {l.endDate?.slice(0, 10)}</p>
                  </div>
                </div>
                <Badge variant="yellow">{l.leaveType}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <p className="text-sm font-bold text-white/90 mb-4">Department Headcount</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={deptData.map(d => ({ name: d.name, count: d.value }))} barSize={28} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={90} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', background: 'rgba(15,20,35,0.95)', color: '#fff' }} />
              <Bar dataKey="count" fill="#6366f1" radius={[0, 6, 6, 0]} name="Employees" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

// ─── Employee Dashboard ────────────────────────────────────────────────────
function EmployeeDashboard({ user }: { user: any }) {
  const name = user?.employee ? `${user.employee.firstName}` : user?.email?.split('@')[0] ?? 'there';
  const [myAttendance, setMyAttendance] = useState<any[]>([]);
  const [myLeaves, setMyLeaves] = useState<any[]>([]);
  const [clockedIn, setClockedIn] = useState(false);
  const [clockLoading, setClockLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getMyAttendance().catch(() => []),
      getMyLeaves().catch(() => []),
    ]).then(([att, lv]) => {
      setMyAttendance(att);
      setMyLeaves(lv);
      // Check if already clocked in today
      const today = new Date().toISOString().slice(0, 10);
      const todayRecord = att.find((a: any) => a.date?.slice(0, 10) === today);
      if (todayRecord && todayRecord.checkIn && !todayRecord.checkOut) setClockedIn(true);
    }).finally(() => setLoading(false));
  }, []);

  const handleClockIn = async () => {
    setClockLoading(true);
    try { await clockIn(); setClockedIn(true); } catch (e: any) { alert(e.message); }
    setClockLoading(false);
  };

  const handleClockOut = async () => {
    setClockLoading(true);
    try { await clockOut(); setClockedIn(false); } catch (e: any) { alert(e.message); }
    setClockLoading(false);
  };

  if (loading) return <LoadingState />;

  const attendanceRate = myAttendance.length ? Math.round(myAttendance.filter((a: any) => ['PRESENT', 'LATE'].includes(a.status)).length / myAttendance.length * 100) : 0;
  const pendingLeaves = myLeaves.filter((l: any) => l.status === 'PENDING').length;
  const approvedLeaves = myLeaves.filter((l: any) => l.status === 'APPROVED').length;

  return (
    <div className="space-y-5">
      {/* Clock In/Out Banner */}
      <div className="dark-card-glow p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Zap size={22} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Good morning, {name}! 👋</h2>
            <p className="text-sm text-gray-400">
              {clockedIn ? "You're clocked in. Have a productive day!" : "Don't forget to clock in!"}
            </p>
          </div>
        </div>
        <button
          onClick={clockedIn ? handleClockOut : handleClockIn}
          disabled={clockLoading}
          className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${clockedIn ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'}`}
        >
          {clockLoading ? '...' : clockedIn ? '⏹ Clock Out' : '▶ Clock In'}
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Attendance Rate" value={`${attendanceRate}%`} icon={<Clock size={16} />} iconBg="bg-emerald-500" />
        <StatCard title="Days Tracked" value={myAttendance.length} icon={<BarChart2 size={16} />} iconBg="bg-indigo-500" />
        <StatCard title="Leaves Approved" value={approvedLeaves} icon={<CalendarOff size={16} />} iconBg="bg-amber-500" />
        <StatCard title="Leaves Pending" value={pendingLeaves} icon={<Sparkles size={16} />} iconBg="bg-violet-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <p className="text-sm font-bold text-white/90 mb-4">Recent Attendance</p>
          <div className="space-y-2">
            {myAttendance.slice(0, 5).map((a: any) => (
              <div key={a.id} className="flex items-center justify-between p-2.5 rounded-lg bg-white/5">
                <span className="text-sm text-gray-300">{a.date?.slice(0, 10)}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{a.checkIn?.slice(11, 16) || '—'} → {a.checkOut?.slice(11, 16) || '—'}</span>
                  <Badge variant={a.status === 'PRESENT' ? 'green' : a.status === 'LATE' ? 'yellow' : 'red'}>{a.status}</Badge>
                </div>
              </div>
            ))}
            {myAttendance.length === 0 && <p className="text-sm text-gray-500">No attendance records yet</p>}
          </div>
        </Card>

        <Card>
          <p className="text-sm font-bold text-white/90 mb-4">My Leaves</p>
          <div className="space-y-2">
            {myLeaves.slice(0, 5).map((l: any) => (
              <div key={l.id} className="flex items-center justify-between p-2.5 rounded-lg bg-white/5">
                <div>
                  <p className="text-sm text-gray-300">{l.leaveType} Leave</p>
                  <p className="text-xs text-gray-500">{l.startDate?.slice(0, 10)} → {l.endDate?.slice(0, 10)}</p>
                </div>
                <Badge variant={l.status === 'APPROVED' ? 'green' : l.status === 'PENDING' ? 'yellow' : 'red'}>{l.status}</Badge>
              </div>
            ))}
            {myLeaves.length === 0 && <p className="text-sm text-gray-500">No leave requests</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── Main Dashboard ────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user } = useAuth();
  const role = user?.role;

  if (role === 'ADMIN') return <AdminDashboard />;
  if (role === 'HR') return <HRDashboard />;
  return <EmployeeDashboard user={user} />;
}
