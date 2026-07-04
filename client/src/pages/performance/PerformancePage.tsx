import React, { useEffect, useState } from 'react';
import { TrendingUp, Star, Target, CheckSquare, AlertTriangle, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Table, Badge, Avatar, PageHeader, LoadingState, Card, StatCard, Modal } from '../../components/ui';
import { getPerformanceReviews, getPerformanceSummary, getPerformanceTrend, getRatingColor, type PerformanceReview, type PerformanceSummary as PSummary } from '../../services/performance.service';

function ScoreBar({ score, label }: { score: number; label?: string }) {
  const color = score >= 85 ? 'bg-green-500' : score >= 70 ? 'bg-[#C54B8C]' : score >= 50 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-[10px] font-bold text-black/40 w-16 shrink-0">{label}</span>}
      <div className="flex-1 bg-black/10 rounded-full h-2 border border-black/20">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(score, 100)}%` }} />
      </div>
      <span className="text-xs font-black text-black w-10 text-right">{score}%</span>
    </div>
  );
}

function BreakdownModal({ review, onClose }: { review: PerformanceReview; onClose: () => void }) {
  const b = review.breakdown;
  if (!b) return null;

  const weights = [
    { label: 'Task Completion', score: b.taskCompletionScore, contribution: b.taskCompletionContribution, weight: '30%' },
    { label: 'Goal Achievement', score: b.goalAchievementScore, contribution: b.goalAchievementContribution, weight: '25%' },
    { label: 'Manager Rating', score: b.managerRatingScore, contribution: b.managerRatingContribution, weight: '20%' },
    { label: 'Attendance', score: b.attendanceConsistencyScore, contribution: b.attendanceContribution, weight: '15%' },
    { label: 'Skill Growth', score: b.skillGrowthScore, contribution: b.skillGrowthContribution, weight: '10%' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative neo-card w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-black text-black uppercase">{review.employee.firstName} {review.employee.lastName}</h3>
            <p className="text-[11px] text-black/40 font-medium">{review.reviewPeriod} · {review.employee.department?.name}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center hover:bg-black/5"><X size={14} /></button>
        </div>

        {/* Final Score */}
        <div className="neo-card-sm p-4 text-center mb-5 bg-[#fce4ec]">
          <p className="text-4xl font-black text-[#C54B8C]">{b.finalScore}</p>
          <Badge variant={getRatingColor(b.rating)}>{b.rating}</Badge>
        </div>

        {/* Breakdown Table */}
        <p className="text-xs font-black text-black uppercase tracking-widest mb-3">Score Breakdown</p>
        <div className="space-y-3">
          {weights.map(w => (
            <div key={w.label} className="p-3 border-2 border-black/10 rounded-xl">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-bold text-black">{w.label}</span>
                <span className="text-[10px] font-bold text-black/30">Weight: {w.weight}</span>
              </div>
              <ScoreBar score={w.score} />
              <p className="text-[10px] text-black/40 mt-1 font-medium">
                {w.score.toFixed(1)} × {w.weight} = <span className="font-black text-black">{w.contribution.toFixed(2)}</span>
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-green-50 border-2 border-green-300 rounded-xl flex items-center justify-between">
          <span className="text-sm font-black text-green-700">Final Score</span>
          <span className="text-sm font-black text-green-700">{weights.reduce((s, w) => s + w.contribution, 0).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

export default function PerformancePage() {
  const [reviews, setReviews] = useState<PerformanceReview[]>([]);
  const [summary, setSummary] = useState<PSummary | null>(null);
  const [trend, setTrend] = useState<{ period: string; averageScore: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<PerformanceReview | null>(null);

  useEffect(() => {
    Promise.all([getPerformanceReviews(), getPerformanceSummary(), getPerformanceTrend()])
      .then(([r, s, t]) => { setReviews(r); setSummary(s); setTrend(t); })
      .finally(() => setLoading(false));
  }, []);

  // Show only latest review per employee
  const latestReviews = Object.values(
    reviews.reduce((acc, r) => { if (!acc[r.employeeId] || r.reviewPeriod > acc[r.employeeId].reviewPeriod) acc[r.employeeId] = r; return acc; }, {} as Record<string, PerformanceReview>)
  ).sort((a, b) => b.overallScore - a.overallScore);

  const columns = [
    {
      key: 'employee', header: 'Employee', render: (r: PerformanceReview) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={`${r.employee.firstName} ${r.employee.lastName}`} size="sm" />
          <div>
            <p className="text-sm font-bold text-black">{r.employee.firstName} {r.employee.lastName}</p>
            <p className="text-[11px] text-black/40 font-medium">{r.employee.department?.name}</p>
          </div>
        </div>
      ),
    },
    { key: 'tasks', header: 'Tasks', render: (r: PerformanceReview) => <span className="text-sm font-bold text-black/70">{r.tasksCompleted}/{r.assignedTasks || r.totalGoals}</span> },
    { key: 'goals', header: 'Goals', render: (r: PerformanceReview) => <span className="text-sm font-bold text-black/70">{r.goalsAchieved}/{r.assignedGoals || r.totalGoals}</span> },
    { key: 'rating_mgr', header: 'Mgr', render: (r: PerformanceReview) => <div className="flex items-center gap-1"><Star size={12} className="text-amber-500 fill-amber-500" /><span className="text-sm font-black">{r.managerRating}</span></div> },
    { key: 'score', header: 'Score', render: (r: PerformanceReview) => <ScoreBar score={r.overallScore} /> },
    { key: 'rating', header: 'Rating', render: (r: PerformanceReview) => <Badge variant={getRatingColor(r.rating)}>{r.rating}</Badge> },
    { key: 'action', header: '', render: (r: PerformanceReview) => <button onClick={() => setSelectedReview(r)} className="btn-neo-secondary px-2 py-1 text-[10px]">Details</button> },
  ];

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-5">
      <PageHeader title="Performance" description="Weighted scoring engine · Task 30% · Goals 25% · Rating 20% · Attendance 15% · Skills 10%" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Avg Score" value={`${summary?.avgScore ?? 0}%`} icon={<TrendingUp size={16} />} iconBg="bg-[#fce4ec] text-[#C54B8C]" />
        <StatCard title="Top Performer" value={summary?.topPerformer ?? '—'} icon={<Star size={16} />} iconBg="bg-amber-100 text-amber-700" />
        <StatCard title="Needs Attention" value={summary?.needsAttention ?? 0} icon={<AlertTriangle size={16} />} iconBg="bg-red-100 text-red-600" />
        <StatCard title="Total Reviews" value={summary?.totalReviews ?? 0} icon={<CheckSquare size={16} />} iconBg="bg-green-100 text-green-700" />
      </div>

      {/* Trend Chart */}
      {trend.length > 1 && (
        <Card>
          <p className="text-xs font-black text-black uppercase tracking-widest mb-4">Performance Trend</p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#000', fontWeight: 700 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#000', fontWeight: 700 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '2px solid #000', boxShadow: '4px 4px 0px rgba(0,0,0,1)' }} />
              <Line type="monotone" dataKey="averageScore" stroke="#C54B8C" strokeWidth={3} dot={{ fill: '#C54B8C', r: 5, strokeWidth: 2, stroke: '#000' }} name="Avg Score" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Reviews Table */}
      <Card padding={false}>
        <Table columns={columns} data={latestReviews} keyExtractor={r => r.id} />
      </Card>

      {selectedReview && <BreakdownModal review={selectedReview} onClose={() => setSelectedReview(null)} />}
    </div>
  );
}
