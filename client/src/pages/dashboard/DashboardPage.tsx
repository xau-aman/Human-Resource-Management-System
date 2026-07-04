import React, { useEffect, useState } from 'react';
import { Users, Clock, CalendarOff, TrendingUp, Sparkles, CheckCircle, AlertTriangle, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from 'recharts';
import { StatCard, Card, Avatar, Badge, LoadingState, Logo } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { getDashboardStats, getAttendanceChartData, getDepartmentDistribution, getRecentActivity, getUpcomingLeaves } from '../../services/dashboard.service';
import { getMyAttendance, clockIn, clockOut } from '../../services/attendance.service';
import { getMyLeaves } from '../../services/leave.service';

const COLORS = ['#C54B8C', '#880e4f', '#f06292', '#ad1457'];

function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [deptData, setDeptData] = useState<any[]>([]);
  const [upcomingLeaves, setUpcomingLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDashboardStats(), getAttendanceChartData(), getDepartmentDistribution(), getUpcomingLeaves()])
      .then(([s, a, d, l]) => { setStats(s); setAttendanceData(a); setDeptData(d); setUpcomingLeaves(l); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState />;
  const activity = getRecentActivity();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Employees" value={stats?.totalEmployees ?? 0} icon={<Users size={16} />} iconBg="bg-[#fce4ec] text-[#C54B8C]" />
        <StatCard title="Present Today" value={stats?.presentToday ?? 0} icon={<Clock size={16} />} iconBg="bg-green-100 text-green-700" />
        <StatCard title="On Leave" value={stats?.onLeave ?? 0} icon={<CalendarOff size={16} />} iconBg="bg-amber-100 text-amber-700" />
        <StatCard title="Pending Leaves" value={upcomingLeaves.length} icon={<AlertTriangle size={16} />} iconBg="bg-red-100 text-red-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <p className="text-xs font-black text-black uppercase tracking-widest mb-4">Attendance Trend</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={attendanceData} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#000', fontWeight: 700 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#000', fontWeight: 700 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '2px solid #000', boxShadow: '4px 4px 0px rgba(0,0,0,1)', background: '#fff' }} />
              <Bar dataKey="present" fill="#C54B8C" radius={[6, 6, 0, 0]} name="Present" />
              <Bar dataKey="late" fill="#f59e0b" radius={[6, 6, 0, 0]} name="Late" />
              <Bar dataKey="absent" fill="#ef4444" radius={[6, 6, 0, 0]} name="Absent" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <p className="text-xs font-black text-black uppercase tracking-widest mb-4">Departments</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={deptData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={4}>
                {deptData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: '2px solid #000', boxShadow: '3px 3px 0px rgba(0,0,0,1)' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-3">
            {deptData.map((d, i) => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full border-2 border-black" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-xs font-bold text-black/60">{d.name}</span>
                </div>
                <span className="text-xs font-black text-black">{d.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <p className="text-xs font-black text-black uppercase tracking-widest mb-4">Pending Leaves</p>
          <div className="space-y-3">
            {upcomingLeaves.length === 0 && <p className="text-sm text-black/40 font-medium">No pending requests</p>}
            {upcomingLeaves.map((l: any) => (
              <div key={l.id} className="flex items-center justify-between p-3 border-2 border-black/10 rounded-xl">
                <div className="flex items-center gap-2.5">
                  <Avatar name={`${l.employee.firstName} ${l.employee.lastName}`} size="sm" />
                  <div>
                    <p className="text-sm font-bold text-black">{l.employee.firstName} {l.employee.lastName}</p>
                    <p className="text-[11px] text-black/40 font-medium">{l.startDate?.slice(0, 10)} → {l.endDate?.slice(0, 10)}</p>
                  </div>
                </div>
                <Badge variant="yellow">{l.leaveType}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <p className="text-xs font-black text-black uppercase tracking-widest mb-4">Recent Activity</p>
          <div className="space-y-3">
            {activity.map(a => (
              <div key={a.id} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#C54B8C] mt-2 flex-shrink-0 border border-black" />
                <div>
                  <p className="text-sm text-black/70 font-medium">{a.message}</p>
                  <p className="text-[11px] text-black/30 font-bold mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

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
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Employees" value={stats?.totalEmployees ?? 0} icon={<Users size={16} />} iconBg="bg-[#fce4ec] text-[#C54B8C]" />
        <StatCard title="Pending Leaves" value={pendingLeaves.length} icon={<CalendarOff size={16} />} iconBg="bg-amber-100 text-amber-700" />
        <StatCard title="Present Today" value={stats?.presentToday ?? 0} icon={<CheckCircle size={16} />} iconBg="bg-green-100 text-green-700" />
        <StatCard title="On Leave" value={stats?.onLeave ?? 0} icon={<AlertTriangle size={16} />} iconBg="bg-red-100 text-red-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <p className="text-xs font-black text-black uppercase tracking-widest mb-4">Pending Leave Requests</p>
          <div className="space-y-3">
            {pendingLeaves.length === 0 && <p className="text-sm text-black/40">No pending requests</p>}
            {pendingLeaves.map((l: any) => (
              <div key={l.id} className="flex items-center justify-between p-3 border-2 border-black/10 rounded-xl">
                <div className="flex items-center gap-2.5">
                  <Avatar name={`${l.employee.firstName} ${l.employee.lastName}`} size="sm" />
                  <div>
                    <p className="text-sm font-bold text-black">{l.employee.firstName} {l.employee.lastName}</p>
                    <p className="text-[11px] text-black/40">{l.startDate?.slice(0, 10)} → {l.endDate?.slice(0, 10)}</p>
                  </div>
                </div>
                <Badge variant="yellow">{l.leaveType}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <p className="text-xs font-black text-black uppercase tracking-widest mb-4">Department Headcount</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={deptData.map(d => ({ name: d.name, count: d.value }))} barSize={28} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#000', fontWeight: 700 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#000', fontWeight: 600 }} axisLine={false} tickLine={false} width={90} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '2px solid #000', boxShadow: '3px 3px 0px rgba(0,0,0,1)' }} />
              <Bar dataKey="count" fill="#C54B8C" radius={[0, 8, 8, 0]} name="Employees" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

function EmployeeDashboard({ user }: { user: any }) {
  const name = user?.employee?.firstName ?? user?.email?.split('@')[0] ?? 'there';
  const [myAttendance, setMyAttendance] = useState<any[]>([]);
  const [myLeaves, setMyLeaves] = useState<any[]>([]);
  const [clockedIn, setClockedIn] = useState(false);
  const [clockLoading, setClockLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMyAttendance().catch(() => []), getMyLeaves().catch(() => [])])
      .then(([att, lv]) => {
        setMyAttendance(att); setMyLeaves(lv);
        const today = new Date().toISOString().slice(0, 10);
        const todayRecord = att.find((a: any) => a.date?.slice(0, 10) === today && a.checkIn && !a.checkOut);
        if (todayRecord) setClockedIn(true);
      }).finally(() => setLoading(false));
  }, []);

  const handleClockIn = async () => { setClockLoading(true); try { await clockIn(); setClockedIn(true); } catch (e: any) { alert(e.message); } setClockLoading(false); };
  const handleClockOut = async () => { setClockLoading(true); try { await clockOut(); setClockedIn(false); } catch (e: any) { alert(e.message); } setClockLoading(false); };

  if (loading) return <LoadingState />;

  const attendanceRate = myAttendance.length ? Math.round(myAttendance.filter((a: any) => ['PRESENT', 'LATE'].includes(a.status)).length / myAttendance.length * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Clock In/Out Banner */}
      <div className="neo-card-accent p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Logo size="lg" />
          <div>
            <h2 className="text-lg font-black text-black uppercase">Hey, {name}! 👋</h2>
            <p className="text-sm text-black/40 font-medium">{clockedIn ? "You're clocked in. Crush it today!" : "Don't forget to clock in!"}</p>
          </div>
        </div>
        <button onClick={clockedIn ? handleClockOut : handleClockIn} disabled={clockLoading}
          className={clockedIn ? 'btn-neo-danger px-5 py-2.5 text-xs' : 'btn-neo px-5 py-2.5 text-xs'}>
          {clockLoading ? '...' : clockedIn ? '⏹ Clock Out' : '▶ Clock In'}
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Attendance" value={`${attendanceRate}%`} icon={<Clock size={16} />} iconBg="bg-green-100 text-green-700" />
        <StatCard title="Days Tracked" value={myAttendance.length} icon={<BarChart2 size={16} />} iconBg="bg-[#fce4ec] text-[#C54B8C]" />
        <StatCard title="Approved" value={myLeaves.filter((l: any) => l.status === 'APPROVED').length} icon={<CalendarOff size={16} />} iconBg="bg-blue-100 text-blue-700" />
        <StatCard title="Pending" value={myLeaves.filter((l: any) => l.status === 'PENDING').length} icon={<Sparkles size={16} />} iconBg="bg-amber-100 text-amber-700" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <p className="text-xs font-black text-black uppercase tracking-widest mb-4">Recent Attendance</p>
          <div className="space-y-2">
            {myAttendance.slice(0, 5).map((a: any) => (
              <div key={a.id} className="flex items-center justify-between p-3 border-2 border-black/10 rounded-xl">
                <span className="text-sm font-bold text-black">{a.date?.slice(0, 10)}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-black/40 font-medium">{a.checkIn?.slice(11, 16) || '—'} → {a.checkOut?.slice(11, 16) || '—'}</span>
                  <Badge variant={a.status === 'PRESENT' ? 'green' : a.status === 'LATE' ? 'yellow' : 'red'}>{a.status}</Badge>
                </div>
              </div>
            ))}
            {myAttendance.length === 0 && <p className="text-sm text-black/40">No records yet</p>}
          </div>
        </Card>

        <Card>
          <p className="text-xs font-black text-black uppercase tracking-widest mb-4">My Leaves</p>
          <div className="space-y-2">
            {myLeaves.slice(0, 5).map((l: any) => (
              <div key={l.id} className="flex items-center justify-between p-3 border-2 border-black/10 rounded-xl">
                <div>
                  <p className="text-sm font-bold text-black">{l.leaveType} Leave</p>
                  <p className="text-[11px] text-black/40">{l.startDate?.slice(0, 10)} → {l.endDate?.slice(0, 10)}</p>
                </div>
                <Badge variant={l.status === 'APPROVED' ? 'green' : l.status === 'PENDING' ? 'yellow' : 'red'}>{l.status}</Badge>
              </div>
            ))}
            {myLeaves.length === 0 && <p className="text-sm text-black/40">No leave requests</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const role = user?.role;
  if (role === 'ADMIN') return <AdminDashboard />;
  if (role === 'HR') return <HRDashboard />;
  return <EmployeeDashboard user={user} />;
}
