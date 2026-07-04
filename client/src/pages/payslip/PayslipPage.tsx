import React, { useEffect, useState } from 'react';
import { IndianRupee, Download, Building2, Calendar, Briefcase } from 'lucide-react';
import { Card, LoadingState, ErrorState } from '../../components/ui';
import { api } from '../../config/api';

interface PayslipData {
  employee: { id: string; employeeId: string; firstName: string; lastName: string; designation: string; department: string; joiningDate: string };
  salary: { gross: number; net: number; basic: number; hra: number; da: number; special: number; deductions: { pf: number; tax: number; professionalTax: number; total: number }; month: string };
}

function fmt(n: number) { return '₹' + n.toLocaleString('en-IN'); }

export default function PayslipPage() {
  const [data, setData] = useState<PayslipData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get<{ data: PayslipData }>('/payslip/me').then(r => setData(r.data)).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState message="Loading payslip..." />;
  if (error || !data) return <ErrorState message={error || 'Failed to load'} />;

  const { employee: emp, salary } = data;

  const handleDownload = () => {
    const lines = [
      `PAYSLIP - ${salary.month}`, '', `Employee: ${emp.firstName} ${emp.lastName}`, `ID: ${emp.employeeId}`, `Designation: ${emp.designation}`, `Department: ${emp.department}`, '',
      'EARNINGS', `Basic: ${salary.basic}`, `HRA: ${salary.hra}`, `DA: ${salary.da}`, `Special Allowance: ${salary.special}`, `Gross: ${salary.gross}`, '',
      'DEDUCTIONS', `PF: ${salary.deductions.pf}`, `Income Tax: ${salary.deductions.tax}`, `Professional Tax: ${salary.deductions.professionalTax}`, `Total Deductions: ${salary.deductions.total}`, '',
      `NET PAY: ${salary.net}`,
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `payslip-${salary.month.replace(' ', '-')}.txt`; a.click();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-black uppercase tracking-tight">Payslip</h1>
          <p className="text-sm text-black/40 mt-0.5 font-medium">{salary.month}</p>
        </div>
        <button onClick={handleDownload} className="btn-neo px-4 py-2 text-[11px] flex items-center gap-2"><Download size={13} /> Download</button>
      </div>

      {/* Employee Info */}
      <Card>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Briefcase, label: 'Employee ID', value: emp.employeeId },
            { icon: Building2, label: 'Department', value: emp.department },
            { icon: Briefcase, label: 'Designation', value: emp.designation },
            { icon: Calendar, label: 'Joining Date', value: new Date(emp.joiningDate).toLocaleDateString('en-IN') },
          ].map(item => (
            <div key={item.label} className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#fce4ec] border-2 border-black flex items-center justify-center shrink-0"><item.icon size={14} /></div>
              <div>
                <p className="text-[10px] text-black/40 font-bold uppercase tracking-wider">{item.label}</p>
                <p className="text-sm font-bold text-black">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Net Pay Banner */}
      <div className="neo-card p-6 bg-[#C54B8C] text-center">
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Net Pay</p>
        <p className="text-4xl font-black text-white mt-1">{fmt(salary.net)}</p>
        <p className="text-xs text-white/50 mt-1">per month</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Earnings */}
        <Card>
          <p className="text-xs font-black text-black uppercase tracking-widest mb-4 flex items-center gap-2"><IndianRupee size={13} /> Earnings</p>
          <div className="space-y-3">
            {[
              { label: 'Basic Salary', value: salary.basic, pct: '50%' },
              { label: 'HRA', value: salary.hra, pct: '20%' },
              { label: 'Dearness Allowance', value: salary.da, pct: '10%' },
              { label: 'Special Allowance', value: salary.special, pct: '20%' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between p-3 border-2 border-black/10 rounded-xl">
                <div>
                  <p className="text-sm font-bold text-black">{item.label}</p>
                  <p className="text-[10px] text-black/30 font-medium">{item.pct} of gross</p>
                </div>
                <p className="text-sm font-black text-black">{fmt(item.value)}</p>
              </div>
            ))}
            <div className="flex items-center justify-between p-3 bg-green-50 border-2 border-green-300 rounded-xl">
              <p className="text-sm font-black text-green-700">Gross Salary</p>
              <p className="text-sm font-black text-green-700">{fmt(salary.gross)}</p>
            </div>
          </div>
        </Card>

        {/* Deductions */}
        <Card>
          <p className="text-xs font-black text-black uppercase tracking-widest mb-4 flex items-center gap-2"><IndianRupee size={13} /> Deductions</p>
          <div className="space-y-3">
            {[
              { label: 'Provident Fund (PF)', value: salary.deductions.pf, desc: '12% of basic' },
              { label: 'Income Tax (TDS)', value: salary.deductions.tax, desc: '10% of gross' },
              { label: 'Professional Tax', value: salary.deductions.professionalTax, desc: 'Fixed' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between p-3 border-2 border-black/10 rounded-xl">
                <div>
                  <p className="text-sm font-bold text-black">{item.label}</p>
                  <p className="text-[10px] text-black/30 font-medium">{item.desc}</p>
                </div>
                <p className="text-sm font-black text-red-500">-{fmt(item.value)}</p>
              </div>
            ))}
            <div className="flex items-center justify-between p-3 bg-red-50 border-2 border-red-300 rounded-xl">
              <p className="text-sm font-black text-red-700">Total Deductions</p>
              <p className="text-sm font-black text-red-700">-{fmt(salary.deductions.total)}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
