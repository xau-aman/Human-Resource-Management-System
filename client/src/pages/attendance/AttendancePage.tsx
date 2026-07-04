import React, { useEffect, useState } from 'react';
import { UserCheck, UserX, Clock, Users, Play, Square } from 'lucide-react';
import type { AttendanceRecord, AttendanceSummary } from '../../types';
import { getAttendance, getAttendanceSummary, getMyAttendance, clockIn, clockOut } from '../../services/attendance.service';
import { StatCard, Table, Badge, Avatar, PageHeader, LoadingState, Card } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';

const statusBadge: Record<string, 'green' | 'red' | 'yellow' | 'blue' | 'gray'> = {
  PRESENT: 'green', ABSENT: 'red', LATE: 'yellow', HALF_DAY: 'blue', HOLIDAY: 'gray',
};

export default function AttendancePage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'HR';
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [clockedIn, setClockedIn] = useState(false);
  const [clockLoading, setClockLoading] = useState(false);

  useEffect(() => {
    const fetchData = isAdmin
      ? Promise.all([getAttendance(), getAttendanceSummary()])
      : Promise.all([getMyAttendance(), getAttendanceSummary()]);

    fetchData.then(([r, s]) => {
      setRecords(r);
      setSummary(s);
      // Check if clocked in today
      const today = new Date().toISOString().slice(0, 10);
      const todayRecord = r.find((a: any) => a.date?.slice(0, 10) === today && a.checkIn && !a.checkOut);
      if (todayRecord) setClockedIn(true);
    }).finally(() => setLoading(false));
  }, [isAdmin]);

  const handleClockIn = async () => {
    setClockLoading(true);
    try {
      const record = await clockIn();
      setRecords(prev => [record, ...prev]);
      setClockedIn(true);
    } catch (e: any) { alert(e.message); }
    setClockLoading(false);
  };

  const handleClockOut = async () => {
    setClockLoading(true);
    try {
      const record = await clockOut();
      setRecords(prev => prev.map(r => r.id === record.id ? record : r));
      setClockedIn(false);
    } catch (e: any) { alert(e.message); }
    setClockLoading(false);
  };

  const columns = [
    {
      key: 'employee', header: 'Employee', render: (r: AttendanceRecord) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={`${r.employee.firstName} ${r.employee.lastName}`} size="sm" />
          <div>
            <p className="text-sm font-medium text-white/90">{r.employee.firstName} {r.employee.lastName}</p>
            <p className="text-xs text-gray-500">{r.employee.department?.name}</p>
          </div>
        </div>
      ),
    },
    { key: 'date', header: 'Date', render: (r: AttendanceRecord) => <span className="text-sm text-gray-400">{r.date?.slice(0, 10)}</span> },
    { key: 'checkIn', header: 'Check In', render: (r: AttendanceRecord) => <span className="text-sm font-mono text-gray-300">{r.checkIn?.slice(11, 16) || '—'}</span> },
    { key: 'checkOut', header: 'Check Out', render: (r: AttendanceRecord) => <span className="text-sm font-mono text-gray-300">{r.checkOut?.slice(11, 16) || '—'}</span> },
    { key: 'hours', header: 'Hours', render: (r: AttendanceRecord) => <span className="text-sm text-gray-300">{r.workingHours ? `${r.workingHours}h` : '—'}</span> },
    { key: 'status', header: 'Status', render: (r: AttendanceRecord) => <Badge variant={statusBadge[r.status] ?? 'gray'}>{r.status}</Badge> },
  ];

  return (
    <div>
      <PageHeader title="Attendance" description={isAdmin ? "All employees attendance" : "Your attendance records"} />

      {/* Clock In/Out */}
      <Card className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-white/80">Today's Status</p>
          <p className="text-xs text-gray-500 mt-0.5">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="flex items-center gap-3">
          {clockedIn ? (
            <button onClick={handleClockOut} disabled={clockLoading} className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-sm font-medium hover:bg-red-500/30 transition-all">
              <Square size={14} /> {clockLoading ? 'Processing...' : 'Clock Out'}
            </button>
          ) : (
            <button onClick={handleClockIn} disabled={clockLoading} className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-sm font-medium hover:bg-emerald-500/30 transition-all">
              <Play size={14} /> {clockLoading ? 'Processing...' : 'Clock In'}
            </button>
          )}
        </div>
      </Card>

      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard title="Present" value={summary.present} icon={<UserCheck size={18} />} iconBg="bg-emerald-500" />
          <StatCard title="Absent" value={summary.absent} icon={<UserX size={18} />} iconBg="bg-red-500" />
          <StatCard title="Late" value={summary.late} icon={<Clock size={18} />} iconBg="bg-amber-500" />
          <StatCard title="Total Tracked" value={summary.total} icon={<Users size={18} />} iconBg="bg-indigo-500" />
        </div>
      )}

      <Card padding={false}>
        {loading ? <LoadingState /> : <Table columns={columns} data={records} keyExtractor={r => r.id} />}
      </Card>
    </div>
  );
}
