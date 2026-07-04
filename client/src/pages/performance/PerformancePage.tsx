import React, { useEffect, useState } from 'react';
import type { PerformanceReview } from '../../types';
import { getPerformanceReviews } from '../../services/performance.service';
import { Table, Badge, Avatar, PageHeader, LoadingState, Card, StatCard } from '../../components/ui';
import { TrendingUp, Star, Target, CheckSquare } from 'lucide-react';

// TODO[PERFORMANCE]: Implement performance scoring

function ScoreBar({ score }: { score: number }) {
  const color = score >= 85 ? 'bg-emerald-500' : score >= 70 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-100 rounded-full h-1.5">
        <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs font-semibold text-gray-700 w-10 text-right">{score}%</span>
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
            <p className="text-sm font-medium text-gray-900">{r.employee.firstName} {r.employee.lastName}</p>
            <p className="text-xs text-gray-400">{r.employee.designation}</p>
          </div>
        </div>
      ),
    },
    { key: 'score', header: 'Overall Score', render: (r: PerformanceReview) => <ScoreBar score={r.overallScore} /> },
    { key: 'tasks', header: 'Tasks', render: (r: PerformanceReview) => <span className="text-sm font-semibold text-gray-700">{r.tasksCompleted}</span> },
    { key: 'goals', header: 'Goals', render: (r: PerformanceReview) => <span className="text-sm">{r.goalsAchieved}/{r.totalGoals}</span> },
    {
      key: 'rating', header: 'Manager Rating', render: (r: PerformanceReview) => (
        <div className="flex items-center gap-1"><Star size={12} className="text-amber-400 fill-amber-400" /><span className="text-sm font-medium">{r.managerRating}</span></div>
      ),
    },
    {
      key: 'period', header: 'Period', render: (r: PerformanceReview) => (
        <Badge variant="blue">{r.reviewPeriod}</Badge>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Performance" description="Q4 2024 performance reviews" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Avg Score" value={`${avgScore.toFixed(1)}%`} icon={<TrendingUp size={18} />} />
        <StatCard title="Reviews Done" value={reviews.length} icon={<CheckSquare size={18} />} iconColor="bg-emerald-50 text-emerald-600" />
        <StatCard title="Top Performer" value={topPerformer ? `${topPerformer.employee.firstName}` : '—'} icon={<Star size={18} />} iconColor="bg-amber-50 text-amber-600" />
        <StatCard title="Avg Goals Met" value={reviews.length ? `${Math.round(reviews.reduce((s, r) => s + r.goalsAchieved / r.totalGoals, 0) / reviews.length * 100)}%` : '—'} icon={<Target size={18} />} iconColor="bg-purple-50 text-purple-600" />
      </div>
      <Card padding={false}>
        {loading ? <LoadingState /> : <Table columns={columns} data={reviews} keyExtractor={r => r.id} />}
      </Card>
    </div>
  );
}
