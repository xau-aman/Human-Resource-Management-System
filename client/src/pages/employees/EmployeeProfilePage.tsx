import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Building2, Calendar } from 'lucide-react';
import type { Employee } from '../../types';
import { getEmployeeById } from '../../services/employee.service';
import { Button, Card, Badge, Avatar, LoadingState, ErrorState } from '../../components/ui';
import { mockEmployeeSkills } from '../../data/skills.data';

const statusBadge: Record<string, 'green' | 'gray' | 'yellow' | 'red'> = {
  ACTIVE: 'green', INACTIVE: 'gray', ON_LEAVE: 'yellow', TERMINATED: 'red',
};

const levelColor: Record<string, 'gray' | 'blue' | 'purple' | 'green'> = {
  BEGINNER: 'gray', INTERMEDIATE: 'blue', ADVANCED: 'purple', EXPERT: 'green',
};

export default function EmployeeProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getEmployeeById(id).then(e => { setEmployee(e || null); setLoading(false); });
  }, [id]);

  if (loading) return <LoadingState />;
  if (!employee) return <ErrorState message="Employee not found" onRetry={() => navigate('/employees')} />;

  const skills = mockEmployeeSkills[employee.id] || [];

  return (
    <div>
      <Button variant="ghost" size="sm" onClick={() => navigate('/employees')} className="mb-4">
        <ArrowLeft size={14} /> Back to Employees
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Profile card */}
        <Card className="flex flex-col items-center text-center gap-3">
          <Avatar name={`${employee.firstName} ${employee.lastName}`} size="lg" />
          <div>
            <h2 className="text-lg font-bold text-gray-900">{employee.firstName} {employee.lastName}</h2>
            <p className="text-sm text-gray-500">{employee.designation}</p>
            <p className="text-xs text-gray-400 font-mono mt-1">{employee.employeeId}</p>
          </div>
          <Badge variant={statusBadge[employee.employmentStatus] ?? 'gray'}>{employee.employmentStatus.replace('_', ' ')}</Badge>
        </Card>

        {/* Details */}
        <Card className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-semibold text-gray-800">Employee Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600"><Mail size={14} className="text-gray-400" />{employee.email}</div>
            <div className="flex items-center gap-2 text-sm text-gray-600"><Phone size={14} className="text-gray-400" />{employee.phone || 'N/A'}</div>
            <div className="flex items-center gap-2 text-sm text-gray-600"><Building2 size={14} className="text-gray-400" />{employee.department.name}</div>
            <div className="flex items-center gap-2 text-sm text-gray-600"><Calendar size={14} className="text-gray-400" />Joined {new Date(employee.joiningDate).toLocaleDateString('en-IN')}</div>
          </div>

          {skills.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-2">Skills</p>
              <div className="flex flex-wrap gap-2">
                {skills.map(s => (
                  <div key={s.id} className="flex items-center gap-1.5 bg-gray-50 rounded-lg px-2.5 py-1">
                    <span className="text-xs font-medium text-gray-700">{s.skill.name}</span>
                    <Badge variant={levelColor[s.level] ?? 'gray'}>{s.level}</Badge>
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
