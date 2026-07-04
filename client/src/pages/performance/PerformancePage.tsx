import React, { useEffect, useState } from 'react';
import type { PerformanceReview } from '../../types';
import { getPerformanceReviews } from '../../services/performance.service';
import { Table, Badge, Avatar, PageHeader, LoadingState, Card, StatCard } from '../../components/ui';
import { TrendingUp, Star, Target, CheckSquare } from 'lucide-react';

function ScoreBar({ score }: { score: number }) {
  const color = score >= 85 ? 'bg-green-500' : score >= 70 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-black/10 rounded-full h-2 border border-black/20">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs font-black text-black w-10 text-right">{score}%</span>
    </div>
  );
}

export default function PerformancePage() {
  const [reviews, setReviews] = useState<PerformanceReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { getPerformanceReviews().then(setReviews).finally(() => setLoading(false)); }, []);

  const avgScore = reviews.length ? reviews.reduce((s, r) => s + r.overallScore, 0) / reviews.length : 0;
  const topPerformer = reviews.reduce((best, r) => r.overallScore > (best?.overallScore ?? 0) ? r : best, reviews[0]);

  const columns = [
    {
      key: 'employee', header: 'Employee', render: (r: PerformanceReview) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={`${r.employee.firstName} ${r.employee.lastName}`} size="sm" />
          <div>
            <p className="text-sm font-bold text-black">{r.employee.firstName} {r.employee.lastName}</p>
            <p className="text-[11px] text-black/40 font-medium">{r.employee.designation}</p>
          </div>
        </div>
      ),
    },
    { key: 'score', header: 'Score', render: (r: PerformanceReview) => <ScoreBar score={r.overallScore} /> },
    { key: 'tasks', header: 'Tasks', render: (r: PerformanceReview) => <span className="text-sm font-black text-black">{r.tasksCompleted}</span> },
    { key: 'goals', header: 'Goals', render: (r: PerformanceReview) => <span className="text-sm font-bold text-black/60">{r.goalsAchieved}/{r.totalGoals}</span> },
    {
      key: 'rating', header: 'Rating', render: (r: PerformanceReview) => (
        <div className="flex items-center gap-1"><Star size={12} className="text-amber-500 fill-amber-500" /><span className="text-sm font-black">{r.managerRating}</span></div>
      ),
    },
    { key: 'period', header: 'Period', render: (r: PerformanceReview) => <Badge variant="purple">{r.reviewPeriod}</Badge> },
  ];

  return (
    <div>
      <PageHeader title="Performance" description="Team performance reviews" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard title="Avg Score" value={`${avgScore.toFixed(1)}%`} icon={<TrendingUp size={16} />} iconBg="bg-[#fce4ec] text-[#C54B8C]" />
        <StatCard title="Reviews" value={reviews.length} icon={<CheckSquare size={16} />} iconBg="bg-green-100 text-green-700" />
        <StatCard title="Top" value={topPerformer ? topPerformer.employee.firstName : '—'} icon={<Star size={16} />} iconBg="bg-amber-100 text-amber-700" />
        <StatCard title="Goals Met" value={reviews.length ? `${Math.round(reviews.reduce((s, r) => s + r.goalsAchieved / r.totalGoals, 0) / reviews.length * 100)}%` : '—'} icon={<Target size={16} />} iconBg="bg-blue-100 text-blue-700" />
      </div>
      <Card padding={false}>
        {loading ? <LoadingState /> : <Table columns={columns} data={reviews} keyExtractor={r => r.id} />}
      </Card>
    </div>
  );
}
