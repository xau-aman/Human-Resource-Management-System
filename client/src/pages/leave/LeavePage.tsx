import React, { useEffect, useState } from 'react';
import { Check, X, Plus } from 'lucide-react';
import type { LeaveRequest } from '../../types';
import { getLeaveRequests, getMyLeaves, approveLeave, rejectLeave, createLeaveRequest } from '../../services/leave.service';
import { Button, Badge, Avatar, Card, PageHeader, LoadingState } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';

const statusBadge: Record<string, 'yellow' | 'green' | 'red'> = { PENDING: 'yellow', APPROVED: 'green', REJECTED: 'red' };
const leaveTypeBadge: Record<string, 'blue' | 'red' | 'green' | 'gray'> = { SICK: 'red', CASUAL: 'blue', PAID: 'green', UNPAID: 'gray' };

export default function LeavePage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'HR';
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ leaveType: 'CASUAL', startDate: '', endDate: '', reason: '' });
  const [submitting, setSubmitting] = useState(false);

  const load = () => { setLoading(true); (isAdmin ? getLeaveRequests(filter || undefined) : getMyLeaves()).then(setRequests).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, [filter, isAdmin]);

  const handleApprove = async (id: string) => { try { const u = await approveLeave(id); setRequests(p => p.map(r => r.id === id ? u : r)); } catch (e: any) { alert(e.message); } };
  const handleReject = async (id: string) => { try { const u = await rejectLeave(id); setRequests(p => p.map(r => r.id === id ? u : r)); } catch (e: any) { alert(e.message); } };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.startDate || !form.endDate || !form.reason) return alert('Fill all fields');
    setSubmitting(true);
    try { const n = await createLeaveRequest(form); setRequests(p => [n, ...p]); setShowModal(false); setForm({ leaveType: 'CASUAL', startDate: '', endDate: '', reason: '' }); } catch (e: any) { alert(e.message); }
    setSubmitting(false);
  };

  return (
    <div>
      <PageHeader title="Leave" description={isAdmin ? `${requests.filter(r => r.status === 'PENDING').length} pending` : `${requests.length} requests`}
        action={
          <div className="flex gap-2">
            {isAdmin && (
              <select value={filter} onChange={e => setFilter(e.target.value)} className="input-neo text-xs px-3 py-2">
                <option value="">All</option><option value="PENDING">Pending</option><option value="APPROVED">Approved</option><option value="REJECTED">Rejected</option>
              </select>
            )}
            <Button onClick={() => setShowModal(true)}><Plus size={12} /> Apply</Button>
          </div>
        }
      />

      {loading ? <LoadingState /> : (
        <div className="space-y-3">
          {requests.length === 0 && <Card><p className="text-sm text-black/40 text-center py-8 font-medium">No leave requests found</p></Card>}
          {requests.map(req => (
            <Card key={req.id} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar name={`${req.employee.firstName} ${req.employee.lastName}`} size="sm" />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-black">{req.employee.firstName} {req.employee.lastName}</p>
                  <p className="text-[11px] text-black/40 font-medium">{req.employee.department?.name} · {req.startDate?.slice(0, 10)} → {req.endDate?.slice(0, 10)}</p>
                  <p className="text-[11px] text-black/30 mt-0.5 truncate">{req.reason}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge variant={leaveTypeBadge[req.leaveType] ?? 'gray'}>{req.leaveType}</Badge>
                <Badge variant={statusBadge[req.status] ?? 'gray'}>{req.status}</Badge>
                {isAdmin && req.status === 'PENDING' && (
                  <>
                    <button onClick={() => handleApprove(req.id)} className="btn-neo-secondary px-2.5 py-1.5 text-[10px] flex items-center gap-1"><Check size={10} /> OK</button>
                    <button onClick={() => handleReject(req.id)} className="btn-neo-danger px-2.5 py-1.5 text-[10px] flex items-center gap-1"><X size={10} /> No</button>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
          <div className="relative neo-card w-full max-w-md p-6">
            <h3 className="text-base font-black text-black uppercase tracking-wide mb-5">Apply Leave</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 block mb-1.5">Type</label>
                <select value={form.leaveType} onChange={e => setForm(f => ({ ...f, leaveType: e.target.value }))} className="input-neo w-full px-3 py-2.5 text-sm">
                  <option value="CASUAL">Casual</option><option value="SICK">Sick</option><option value="PAID">Paid</option><option value="UNPAID">Unpaid</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-[10px] font-bold uppercase tracking-widest text-black/40 block mb-1.5">Start</label><input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} className="input-neo w-full px-3 py-2.5 text-sm" /></div>
                <div><label className="text-[10px] font-bold uppercase tracking-widest text-black/40 block mb-1.5">End</label><input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} className="input-neo w-full px-3 py-2.5 text-sm" /></div>
              </div>
              <div><label className="text-[10px] font-bold uppercase tracking-widest text-black/40 block mb-1.5">Reason</label><textarea value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} className="input-neo w-full px-3 py-2.5 text-sm h-20 resize-none" placeholder="Why?" /></div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-neo-secondary flex-1 py-2.5 text-xs">Cancel</button>
                <button type="submit" disabled={submitting} className="btn-neo flex-1 py-2.5 text-xs">{submitting ? '...' : 'Submit'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
