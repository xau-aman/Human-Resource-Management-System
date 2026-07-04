import React, { useEffect, useState } from 'react';
import { UserCheck, UserX, Clock, Users } from 'lucide-react';
import type { AttendanceRecord, AttendanceSummary } from '../../types';
import { getAttendance, getAttendanceSummary } from '../../services/attendance.service';
import { StatCard, Table, Badge, Avatar, PageHeader, LoadingState } from '../../components/ui';

// TODO[ATTENDANCE]: Implement attendance calculation logic

const statusBadge: Record<string, 'green' | 'red' | 'yellow' | 'blue' | 'gray'> = {
  PRESENT: 'green', ABSENT: 'red', LATE: 'yellow', HALF_DAY: 'blue', HOLIDAY: 'gray',
};

export default function AttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAttendance(), getAttendanceSummary()])
      .then(([r, s]) => { setRecords(r); setSummary(s); })
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    {
      key: 'employee', header: 'Employee', render: (r: AttendanceRecord) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={`${r.employee.firstName} ${r.employee.lastName}`} size="sm" />
          <div>
            <p className="text-sm font-medium text-gray-900">{r.employee.firstName} {r.employee.lastName}</p>
            <p className="text-xs text-gray-400">{r.employee.department.name}</p>
          </div>
        </div>
      ),
    },
    { key: 'date', header: 'Date', render: (r: AttendanceRecord) => <span className="text-sm text-gray-600">{new Date(r.date).toLocaleDateString('en-IN')}</span> },
    { key: 'checkIn', header: 'Check In', render: (r: AttendanceRecord) => <span className="text-sm font-mono">{r.checkIn || '—'}</span> },
    { key: 'checkOut', header: 'Check Out', render: (r: AttendanceRecord) => <span className="text-sm font-mono">{r.checkOut || '—'}</span> },
    { key: 'hours', header: 'Working Hours', render: (r: AttendanceRecord) => <span className="text-sm">{r.workingHours ? `${r.workingHours}h` : '—'}</span> },
    { key: 'status', header: 'Status', render: (r: AttendanceRecord) => <Badge variant={statusBadge[r.status] ?? 'gray'}>{r.status}</Badge> },
  ];

  return (
    <div>
      <PageHeader title="Attendance" description="Today's attendance overview" />
      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard title="Present" value={summary.present} icon={<UserCheck size={18} />} iconColor="bg-emerald-50 text-emerald-600" />
          <StatCard title="Absent" value={summary.absent} icon={<UserX size={18} />} iconColor="bg-red-50 text-red-600" />
          <StatCard title="Late" value={summary.late} icon={<Clock size={18} />} iconColor="bg-amber-50 text-amber-600" />
          <StatCard title="Total Tracked" value={summary.total} icon={<Users size={18} />} />
        </div>
      )}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        {loading ? <LoadingState /> : <Table columns={columns} data={records} keyExtractor={r => r.id} />}
      </div>
    </div>
  );
}
