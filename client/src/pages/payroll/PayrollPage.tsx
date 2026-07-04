import React, { useEffect, useState } from 'react';
import { IndianRupee, Save, Search } from 'lucide-react';
import { Card, Table, Badge, Avatar, Input, LoadingState, StatCard } from '../../components/ui';
import { getEmployees, updateEmployee } from '../../services/employee.service';
import type { Employee } from '../../types';

function fmt(n: number) { return '₹' + n.toLocaleString('en-IN'); }

export default function PayrollPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editSalary, setEditSalary] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getEmployees({ search: search || undefined }).then(setEmployees).finally(() => setLoading(false));
  }, [search]);

  const handleSave = async (id: string) => {
    setSaving(true);
    try {
      await updateEmployee(id, { salary: parseFloat(editSalary) || 0 } as any);
      setEmployees(emps => emps.map(e => e.id === id ? { ...e, salary: parseFloat(editSalary) || 0 } : e));
      setEditingId(null);
    } catch { /* ignore */ }
    setSaving(false);
  };

  const totalPayroll = employees.reduce((sum, e) => sum + ((e as any).salary || 0), 0);
  const avgSalary = employees.length ? Math.round(totalPayroll / employees.length) : 0;

  const columns = [
    {
      key: 'employee', header: 'Employee', render: (e: any) => (
        <div className="flex items-center gap-3">
          <Avatar name={`${e.firstName} ${e.lastName}`} size="sm" />
          <div>
            <p className="font-bold text-black text-sm">{e.firstName} {e.lastName}</p>
            <p className="text-[11px] text-black/40 font-medium">{e.employeeId}</p>
          </div>
        </div>
      ),
    },
    { key: 'department', header: 'Department', render: (e: any) => <span className="text-sm font-semibold text-black/70">{e.department?.name}</span> },
    { key: 'designation', header: 'Designation', render: (e: any) => <span className="text-sm text-black/50">{e.designation}</span> },
    {
      key: 'salary', header: 'Salary (₹/mo)', render: (e: any) => (
        editingId === e.id ? (
          <div className="flex items-center gap-2">
            <input type="number" value={editSalary} onChange={ev => setEditSalary(ev.target.value)} className="input-neo w-28 px-2 py-1 text-sm" autoFocus />
            <button onClick={() => handleSave(e.id)} disabled={saving} className="btn-neo px-2 py-1 text-[10px]"><Save size={12} /></button>
          </div>
        ) : (
          <button onClick={() => { setEditingId(e.id); setEditSalary(String(e.salary || 0)); }} className="text-sm font-black text-[#C54B8C] hover:underline">
            {fmt(e.salary || 0)}
          </button>
        )
      ),
    },
    { key: 'status', header: 'Status', render: (e: any) => <Badge variant={e.employmentStatus === 'ACTIVE' ? 'green' : 'gray'}>{e.employmentStatus}</Badge> },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-black uppercase tracking-tight">Payroll</h1>
        <p className="text-sm text-black/40 mt-0.5 font-medium">Manage employee salaries</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Total Monthly Payroll" value={fmt(totalPayroll)} icon={<IndianRupee size={16} />} iconBg="bg-[#fce4ec] text-[#C54B8C]" />
        <StatCard title="Average Salary" value={fmt(avgSalary)} icon={<IndianRupee size={16} />} iconBg="bg-green-100 text-green-700" />
        <StatCard title="Employees" value={employees.length} icon={<IndianRupee size={16} />} iconBg="bg-blue-100 text-blue-700" />
      </div>

      <div className="flex gap-3">
        <Input leftIcon={<Search size={14} />} placeholder="Search employees..." value={search} onChange={e => setSearch(e.target.value)} className="w-64" />
      </div>

      <Card padding={false}>
        {loading ? <LoadingState /> : <Table columns={columns} data={employees} keyExtractor={(e: any) => e.id} />}
      </Card>

      <p className="text-[11px] text-black/30 font-medium">Click on salary amount to edit. Changes are saved immediately.</p>
    </div>
  );
}
