import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button, Input, Select, Card, PageHeader } from '../../components/ui';
import { createEmployee, getDepartments } from '../../services/employee.service';

export default function AddEmployeePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [deptOptions, setDeptOptions] = useState<{ value: string; label: string }[]>([]);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', designation: '', departmentId: '', joiningDate: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    getDepartments().then(deps => {
      const opts = deps.map(d => ({ value: d.id, label: d.name }));
      setDeptOptions(opts);
      if (opts.length) setForm(f => ({ ...f, departmentId: opts[0].value }));
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await createEmployee(form as any);
      navigate('/employees');
    } catch (err: any) {
      setError(err.message || 'Failed to create employee');
    }
    setLoading(false);
  };

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  return (
    <div>
      <Button variant="ghost" size="sm" onClick={() => navigate('/employees')} className="mb-4">
        <ArrowLeft size={14} /> Back
      </Button>
      <PageHeader title="Add Employee" description="Create a new employee record" />
      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-red-600 font-bold bg-red-50 p-3 rounded-xl border-2 border-red-200">{error}</p>}
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" required value={form.firstName} onChange={set('firstName')} placeholder="Arjun" />
            <Input label="Last Name" required value={form.lastName} onChange={set('lastName')} placeholder="Sharma" />
          </div>
          <Input label="Email" type="email" required value={form.email} onChange={set('email')} placeholder="arjun@workzen.com" />
          <Input label="Phone" value={form.phone} onChange={set('phone')} placeholder="+91 98XXXXXXXX" />
          <Input label="Designation" required value={form.designation} onChange={set('designation')} placeholder="Software Engineer" />
          <Select label="Department" options={deptOptions} value={form.departmentId} onChange={set('departmentId')} />
          <Input label="Joining Date" type="date" required value={form.joiningDate} onChange={set('joiningDate')} />
          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={loading}>Create Employee</Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/employees')}>Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
