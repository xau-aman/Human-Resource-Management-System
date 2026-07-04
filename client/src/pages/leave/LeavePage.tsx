import React, { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';
import type { LeaveRequest } from '../../types';
import { getLeaveRequests, approveLeave, rejectLeave } from '../../services/leave.service';
import { Button, Badge, Avatar, Card, PageHeader, LoadingState, Select } from '../../components/ui';

// TODO[LEAVE]: Add leave balance validation

const statusBadge: Record<string, 'yellow' | 'green' | 'red'> = {
  PENDING: 'yellow', APPROVED: 'green', REJECTED: 'red',
};

const leaveTypeBadge: Record<string, 'blue' | 'red' | 'green' | 'gray'> = {
  SICK: 'red', CASUAL: 'blue', PAID: 'green', UNPAID: 'gray',
};

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
];

export default function LeavePage() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const load = (status?: string) => {
    setLoading(true);
    getLeaveRequests(status || undefined).then(setRequests).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (id: string) => {
    const updated = await approveLeave(id);
    setRequests(prev => prev.map(r => r.id === id ? updated : r));
  };

  const handleReject = async (id: string) => {
    const updated = await rejectLeave(id);
    setRequests(prev => prev.map(r => r.id === id ? updated : r));
  };

  return (
    <div>
      <PageHeader title="Leave Management" description={`${requests.filter(r => r.status === 'PENDING').length} pending requests`} />
      <div className="mb-4">
        <Select options={statusOptions} value={filter} onChange={e => { setFilter(e.target.value); load(e.target.value); }} className="w-44" />
      </div>
      {loading ? <LoadingState /> : (
        <div className="space-y-3">
          {requests.map(req => (
            <Card key={req.id} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar name={`${req.employee.firstName} ${req.employee.lastName}`} size="sm" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900">{req.employee.firstName} {req.employee.lastName}</p>
                  <p className="text-xs text-gray-400">{req.employee.department.name} · {req.startDate} → {req.endDate}</p>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{req.reason}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge variant={leaveTypeBadge[req.leaveType] ?? 'gray'}>{req.leaveType}</Badge>
                <Badge variant={statusBadge[req.status] ?? 'gray'}>{req.status}</Badge>
                {req.status === 'PENDING' && (
                  <>
                    <Button variant="secondary" size="sm" onClick={() => handleApprove(req.id)}><Check size={12} /> Approve</Button>
                    <Button variant="danger" size="sm" onClick={() => handleReject(req.id)}><X size={12} /> Reject</Button>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
