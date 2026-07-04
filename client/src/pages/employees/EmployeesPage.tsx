import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import type { Employee } from '../../types';
import { getEmployees } from '../../services/employee.service';
import { Button, Input, Select, Table, Badge, Avatar, PageHeader, LoadingState } from '../../components/ui';

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
            <p className="font-medium text-gray-900 text-sm">{e.firstName} {e.lastName}</p>
            <p className="text-xs text-gray-400">{e.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'employeeId', header: 'Employee ID', render: (e: Employee) => <span className="text-xs font-mono text-gray-500">{e.employeeId}</span> },
    { key: 'department', header: 'Department', render: (e: Employee) => <span className="text-sm">{e.department.name}</span> },
    { key: 'designation', header: 'Designation', render: (e: Employee) => <span className="text-sm text-gray-600">{e.designation}</span> },
    { key: 'status', header: 'Status', render: (e: Employee) => <Badge variant={statusBadge[e.employmentStatus] ?? 'gray'}>{e.employmentStatus.replace('_', ' ')}</Badge> },
    { key: 'joining', header: 'Joining Date', render: (e: Employee) => <span className="text-sm text-gray-500">{new Date(e.joiningDate).toLocaleDateString('en-IN')}</span> },
    {
      key: 'actions', header: 'Actions', render: (e: Employee) => (
        <Button variant="ghost" size="sm" onClick={() => navigate(`/employees/${e.id}`)}>View</Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Employees"
        description={`${employees.length} employees found`}
        action={<Button onClick={() => navigate('/employees/new')}><Plus size={14} /> Add Employee</Button>}
      />
      <div className="flex flex-wrap gap-3 mb-4">
        <Input leftIcon={<Search size={14} />} placeholder="Search employees..." value={search} onChange={e => setSearch(e.target.value)} className="w-64" />
        <Select options={deptOptions} value={department} onChange={e => setDepartment(e.target.value)} className="w-48" />
        <Select options={statusOptions} value={status} onChange={e => setStatus(e.target.value)} className="w-40" />
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        {loading ? <LoadingState /> : <Table columns={columns} data={employees} keyExtractor={e => e.id} />}
      </div>
    </div>
  );
}
