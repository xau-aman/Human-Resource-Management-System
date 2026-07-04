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
      setRecords(r); setSummary(s);
      const today = new Date().toISOString().slice(0, 10);
      const todayRecord = r.find((a: any) => a.date?.slice(0, 10) === today && a.checkIn && !a.checkOut);
      if (todayRecord) setClockedIn(true);
    }).finally(() => setLoading(false));
  }, [isAdmin]);

  const handleClockIn = async () => { setClockLoading(true); try { const r = await clockIn(); setRecords(prev => [r, ...prev]); setClockedIn(true); } catch (e: any) { alert(e.message); } setClockLoading(false); };
  const handleClockOut = async () => { setClockLoading(true); try { const r = await clockOut(); setRecords(prev => prev.map(x => x.id === r.id ? r : x)); setClockedIn(false); } catch (e: any) { alert(e.message); } setClockLoading(false); };

  const columns = [
    {
      key: 'employee', header: 'Employee', render: (r: AttendanceRecord) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={`${r.employee.firstName} ${r.employee.lastName}`} size="sm" />
          <div>
            <p className="text-sm font-bold text-black">{r.employee.firstName} {r.employee.lastName}</p>
            <p className="text-[11px] text-black/40 font-medium">{r.employee.department?.name}</p>
          </div>
        </div>
      ),
    },
    { key: 'date', header: 'Date', render: (r: AttendanceRecord) => <span className="text-sm text-black/60 font-medium">{r.date?.slice(0, 10)}</span> },
    { key: 'checkIn', header: 'In', render: (r: AttendanceRecord) => <span className="text-sm font-mono font-bold text-black/70">{r.checkIn?.slice(11, 16) || '—'}</span> },
    { key: 'checkOut', header: 'Out', render: (r: AttendanceRecord) => <span className="text-sm font-mono font-bold text-black/70">{r.checkOut?.slice(11, 16) || '—'}</span> },
    { key: 'hours', header: 'Hours', render: (r: AttendanceRecord) => <span className="text-sm font-bold text-black/60">{r.workingHours ? `${r.workingHours}h` : '—'}</span> },
    { key: 'status', header: 'Status', render: (r: AttendanceRecord) => <Badge variant={statusBadge[r.status] ?? 'gray'}>{r.status}</Badge> },
  ];

  return (
    <div>
      <PageHeader title="Attendance" description={isAdmin ? "All employees" : "Your records"} />

      <Card className="mb-5 flex items-center justify-between" glow>
        <div>
          <p className="text-sm font-bold text-black">Today's Status</p>
          <p className="text-[11px] text-black/40 font-medium mt-0.5">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        {clockedIn ? (
          <button onClick={handleClockOut} disabled={clockLoading} className="btn-neo-danger flex items-center gap-2 px-4 py-2 text-[11px]">
            <Square size={12} /> {clockLoading ? '...' : 'Clock Out'}
          </button>
        ) : (
          <button onClick={handleClockIn} disabled={clockLoading} className="btn-neo flex items-center gap-2 px-4 py-2 text-[11px]">
            <Play size={12} /> {clockLoading ? '...' : 'Clock In'}
          </button>
        )}
      </Card>

      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <StatCard title="Present" value={summary.present} icon={<UserCheck size={16} />} iconBg="bg-green-100 text-green-700" />
          <StatCard title="Absent" value={summary.absent} icon={<UserX size={16} />} iconBg="bg-red-100 text-red-600" />
          <StatCard title="Late" value={summary.late} icon={<Clock size={16} />} iconBg="bg-amber-100 text-amber-700" />
          <StatCard title="Total" value={summary.total} icon={<Users size={16} />} iconBg="bg-[#fce4ec] text-[#C54B8C]" />
        </div>
      )}

      <Card padding={false}>
        {loading ? <LoadingState /> : <Table columns={columns} data={records} keyExtractor={r => r.id} />}
      </Card>
    </div>
  );
}
