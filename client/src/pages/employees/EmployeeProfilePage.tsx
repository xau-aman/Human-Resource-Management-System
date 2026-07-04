import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Building2, Calendar, IndianRupee, Save, Briefcase } from 'lucide-react';
import type { Employee } from '../../types';
import { getEmployeeById, updateEmployee } from '../../services/employee.service';
import { Button, Card, Badge, Avatar, LoadingState, ErrorState } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';

const statusBadge: Record<string, 'green' | 'gray' | 'yellow' | 'red'> = {
  ACTIVE: 'green', INACTIVE: 'gray', ON_LEAVE: 'yellow', TERMINATED: 'red',
};
const levelColor: Record<string, 'gray' | 'blue' | 'purple' | 'green'> = {
  BEGINNER: 'gray', INTERMEDIATE: 'blue', ADVANCED: 'purple', EXPERT: 'green',
};

export default function EmployeeProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const isAdmin = hasRole('ADMIN', 'HR');
  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ phone: '', designation: '', salary: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    getEmployeeById(id)
      .then(e => {
        setEmployee(e);
        setEditForm({ phone: e.phone || '', designation: e.designation || '', salary: String((e as any).salary || 0) });
      })
      .catch(() => setEmployee(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    try {
      const data: any = { phone: editForm.phone };
      if (isAdmin) { data.designation = editForm.designation; data.salary = parseFloat(editForm.salary) || 0; }
      const updated = await updateEmployee(id, data);
      setEmployee(updated);
      setEditing(false);
    } catch { /* ignore */ }
    setSaving(false);
  };

  if (loading) return <LoadingState />;
  if (!employee) return <ErrorState message="Employee not found" onRetry={() => navigate('/employees')} />;

  const skills = employee.employeeSkills || [];

  return (
    <div className="space-y-5">
      <Button variant="ghost" size="sm" onClick={() => navigate('/employees')} className="mb-2">
        <ArrowLeft size={14} /> Back to Employees
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Profile Card */}
        <Card className="flex flex-col items-center text-center gap-4 p-6">
          <Avatar name={`${employee.firstName} ${employee.lastName}`} size="lg" />
          <div>
            <h2 className="text-xl font-black text-black uppercase">{employee.firstName} {employee.lastName}</h2>
            <p className="text-sm text-black/50 font-bold">{employee.designation}</p>
            <p className="text-xs text-black/30 font-mono mt-1">{employee.employeeId}</p>
          </div>
          <Badge variant={statusBadge[employee.employmentStatus] ?? 'gray'}>{employee.employmentStatus.replace('_', ' ')}</Badge>
          {(isAdmin || true) && (
            <button onClick={() => setEditing(!editing)} className="btn-neo-secondary px-4 py-2 text-[10px] w-full">
              {editing ? 'Cancel' : 'Edit Profile'}
            </button>
          )}
        </Card>

        {/* Details */}
        <Card className="lg:col-span-2 space-y-5">
          <p className="text-xs font-black text-black uppercase tracking-widest">Employee Details</p>

          {!editing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: Mail, label: 'Email', value: employee.email },
                { icon: Phone, label: 'Phone', value: employee.phone || 'N/A' },
                { icon: Building2, label: 'Department', value: employee.department?.name },
                { icon: Briefcase, label: 'Designation', value: employee.designation },
                { icon: Calendar, label: 'Joined', value: new Date(employee.joiningDate).toLocaleDateString('en-IN') },
                ...(isAdmin ? [{ icon: IndianRupee, label: 'Salary', value: `₹${((employee as any).salary || 0).toLocaleString('en-IN')}/mo` }] : []),
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3 p-3 border-2 border-black/10 rounded-xl">
                  <div className="w-9 h-9 rounded-lg bg-[#fce4ec] border-2 border-black flex items-center justify-center shrink-0">
                    <item.icon size={14} />
                  </div>
                  <div>
                    <p className="text-[10px] text-black/40 font-bold uppercase tracking-wider">{item.label}</p>
                    <p className="text-sm font-bold text-black">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 block mb-1.5">Phone</label>
                <input value={editForm.phone} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))} className="input-neo w-full px-3.5 py-2.5 text-sm" />
              </div>
              {isAdmin && (
                <>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 block mb-1.5">Designation</label>
                    <input value={editForm.designation} onChange={e => setEditForm(f => ({ ...f, designation: e.target.value }))} className="input-neo w-full px-3.5 py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 block mb-1.5">Salary (₹/month)</label>
                    <input type="number" value={editForm.salary} onChange={e => setEditForm(f => ({ ...f, salary: e.target.value }))} className="input-neo w-full px-3.5 py-2.5 text-sm" />
                  </div>
                </>
              )}
              <button onClick={handleSave} disabled={saving} className="btn-neo px-4 py-2 text-[11px] flex items-center gap-2">
                <Save size={13} /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div>
              <p className="text-xs font-black text-black uppercase tracking-widest mb-3">Skills</p>
              <div className="flex flex-wrap gap-2">
                {skills.map((s: any) => (
                  <div key={s.id} className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-black/10 rounded-full">
                    <span className="text-xs font-bold text-black">{s.skill?.name}</span>
                    <Badge variant={levelColor[s.level] ?? 'gray'}>{s.level}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Performance */}
          {employee.performanceReviews?.length > 0 && (
            <div>
              <p className="text-xs font-black text-black uppercase tracking-widest mb-3">Latest Review</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Score', value: `${employee.performanceReviews[0].overallScore}%` },
                  { label: 'Rating', value: `${employee.performanceReviews[0].managerRating}/5` },
                  { label: 'Goals', value: `${employee.performanceReviews[0].goalsAchieved}/${employee.performanceReviews[0].totalGoals}` },
                ].map(item => (
                  <div key={item.label} className="neo-card-sm p-3 text-center">
                    <p className="text-lg font-black text-[#C54B8C]">{item.value}</p>
                    <p className="text-[10px] text-black/40 font-bold uppercase">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
