import React, { useEffect, useState } from 'react';
import { Check, X, Plus } from 'lucide-react';
import type { LeaveRequest } from '../../types';
import { getLeaveRequests, getMyLeaves, approveLeave, rejectLeave, createLeaveRequest } from '../../services/leave.service';
import { Button, Badge, Avatar, Card, PageHeader, LoadingState } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';

const statusBadge: Record<string, 'yellow' | 'green' | 'red'> = {
  PENDING: 'yellow', APPROVED: 'green', REJECTED: 'red',
};

const leaveTypeBadge: Record<string, 'blue' | 'red' | 'green' | 'gray'> = {
  SICK: 'red', CASUAL: 'blue', PAID: 'green', UNPAID: 'gray',
};

export default function LeavePage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'HR';
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ leaveType: 'CASUAL', startDate: '', endDate: '', reason: '' });
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    const fetcher = isAdmin ? getLeaveRequests(filter || undefined) : getMyLeaves();
    fetcher.then(setRequests).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter, isAdmin]);

  const handleApprove = async (id: string) => {
    try {
      const updated = await approveLeave(id);
      setRequests(prev => prev.map(r => r.id === id ? updated : r));
    } catch (e: any) { alert(e.message); }
  };

  const handleReject = async (id: string) => {
    try {
      const updated = await rejectLeave(id);
      setRequests(prev => prev.map(r => r.id === id ? updated : r));
    } catch (e: any) { alert(e.message); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.startDate || !form.endDate || !form.reason) return alert('Fill all fields');
    setSubmitting(true);
    try {
      const newReq = await createLeaveRequest(form);
      setRequests(prev => [newReq, ...prev]);
      setShowModal(false);
      setForm({ leaveType: 'CASUAL', startDate: '', endDate: '', reason: '' });
    } catch (e: any) { alert(e.message); }
    setSubmitting(false);
  };

  const pendingCount = requests.filter(r => r.status === 'PENDING').length;

  return (
    <div>
      <PageHeader
        title="Leave Management"
        description={isAdmin ? `${pendingCount} pending requests` : `${requests.length} total requests`}
        action={
          <div className="flex gap-2">
            {isAdmin && (
              <select value={filter} onChange={e => setFilter(e.target.value)} className="input-dark text-sm px-3 py-2 rounded-xl">
                <option value="">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            )}
            <Button onClick={() => setShowModal(true)}><Plus size={14} /> Apply Leave</Button>
          </div>
        }
      />

      {loading ? <LoadingState /> : (
        <div className="space-y-3">
          {requests.length === 0 && <Card><p className="text-sm text-gray-500 text-center py-8">No leave requests found</p></Card>}
          {requests.map(req => (
            <Card key={req.id} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar name={`${req.employee.firstName} ${req.employee.lastName}`} size="sm" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white/90">{req.employee.firstName} {req.employee.lastName}</p>
                  <p className="text-xs text-gray-500">{req.employee.department?.name} · {req.startDate?.slice(0, 10)} → {req.endDate?.slice(0, 10)}</p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{req.reason}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge variant={leaveTypeBadge[req.leaveType] ?? 'gray'}>{req.leaveType}</Badge>
                <Badge variant={statusBadge[req.status] ?? 'gray'}>{req.status}</Badge>
                {isAdmin && req.status === 'PENDING' && (
                  <>
                    <button onClick={() => handleApprove(req.id)} className="text-xs px-2.5 py-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/30 transition-colors flex items-center gap-1">
                      <Check size={12} /> Approve
                    </button>
                    <button onClick={() => handleReject(req.id)} className="text-xs px-2.5 py-1.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors flex items-center gap-1">
                      <X size={12} /> Reject
                    </button>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Apply Leave Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="dark-card w-full max-w-md p-6 mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-4">Apply for Leave</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Leave Type</label>
                <select value={form.leaveType} onChange={e => setForm(f => ({ ...f, leaveType: e.target.value }))} className="input-dark w-full px-3 py-2 rounded-xl text-sm">
                  <option value="CASUAL">Casual</option>
                  <option value="SICK">Sick</option>
                  <option value="PAID">Paid</option>
                  <option value="UNPAID">Unpaid</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Start Date</label>
                  <input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} className="input-dark w-full px-3 py-2 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">End Date</label>
                  <input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} className="input-dark w-full px-3 py-2 rounded-xl text-sm" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Reason</label>
                <textarea value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} className="input-dark w-full px-3 py-2 rounded-xl text-sm h-20 resize-none" placeholder="Reason for leave..." />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 text-sm text-gray-400 border border-white/10 rounded-xl hover:bg-white/5 transition-colors">Cancel</button>
                <button type="submit" disabled={submitting} className="flex-1 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-colors">
                  {submitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
