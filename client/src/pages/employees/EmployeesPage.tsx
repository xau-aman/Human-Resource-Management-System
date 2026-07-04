import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import type { Employee } from '../../types';
import { getEmployees } from '../../services/employee.service';
import { Button, Input, Select, Table, Badge, Avatar, PageHeader, LoadingState, Card } from '../../components/ui';

const statusBadge: Record<string, 'green' | 'gray' | 'yellow' | 'red'> = {
  ACTIVE: 'green', INACTIVE: 'gray', ON_LEAVE: 'yellow', TERMINATED: 'red',
};

const deptOptions = [
  { value: '', label: 'All Departments' },
  { value: 'Engineering', label: 'Engineering' },
  { value: 'Design', label: 'Design' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Human Resources', label: 'Human Resources' },
];

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'ON_LEAVE', label: 'On Leave' },
  { value: 'INACTIVE', label: 'Inactive' },
];

export default function EmployeesPage() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    setLoading(true);
    getEmployees({ department: department || undefined, status: status || undefined, search: search || undefined })
      .then(setEmployees)
      .finally(() => setLoading(false));
  }, [search, department, status]);

  const columns = [
    {
      key: 'employee', header: 'Employee', render: (e: Employee) => (
        <div className="flex items-center gap-3">
          <Avatar name={`${e.firstName} ${e.lastName}`} size="sm" />
          <div>
            <p className="font-bold text-black text-sm">{e.firstName} {e.lastName}</p>
            <p className="text-[11px] text-black/40 font-medium">{e.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'employeeId', header: 'ID', render: (e: Employee) => <span className="text-xs font-mono font-bold text-black/50">{e.employeeId}</span> },
    { key: 'department', header: 'Department', render: (e: Employee) => <span className="text-sm font-semibold text-black/70">{e.department.name}</span> },
    { key: 'designation', header: 'Role', render: (e: Employee) => <span className="text-sm text-black/50">{e.designation}</span> },
    { key: 'status', header: 'Status', render: (e: Employee) => <Badge variant={statusBadge[e.employmentStatus] ?? 'gray'}>{e.employmentStatus.replace('_', ' ')}</Badge> },
    {
      key: 'actions', header: '', render: (e: Employee) => (
        <Button variant="ghost" size="sm" onClick={() => navigate(`/employees/${e.id}`)}>View →</Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Employees"
        description={`${employees.length} employees found`}
        action={<Button onClick={() => navigate('/employees/new')}><Plus size={14} /> Add</Button>}
      />
      <div className="flex flex-wrap gap-3 mb-5">
        <Input leftIcon={<Search size={14} />} placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="w-56" />
        <Select options={deptOptions} value={department} onChange={e => setDepartment(e.target.value)} className="w-44" />
        <Select options={statusOptions} value={status} onChange={e => setStatus(e.target.value)} className="w-36" />
      </div>
      <Card padding={false}>
        {loading ? <LoadingState /> : <Table columns={columns} data={employees} keyExtractor={e => e.id} />}
      </Card>
    </div>
  );
}
