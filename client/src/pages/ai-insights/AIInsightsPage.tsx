import React, { useEffect, useState, useRef } from 'react';
import { Send, Sparkles, TrendingUp, Users, Clock } from 'lucide-react';
import type { WorkforceInsight } from '../../types';
import { getInsights, askWorkforceQuestion } from '../../services/ai-insights.service';
import { Card, PageHeader, Badge, Button } from '../../components/ui';
import { clsx } from 'clsx';

// TODO[AI-INSIGHTS]: Connect workforce intelligence engine

const insightIcon: Record<string, React.ReactNode> = {
  WORKLOAD_RISK: <Users size={16} />,
  SKILL_GAP: <TrendingUp size={16} />,
  PERFORMANCE_OPPORTUNITY: <Sparkles size={16} />,
  ATTENDANCE_RISK: <Clock size={16} />,
};

const severityBadge: Record<string, 'red' | 'orange' | 'yellow' | 'gray'> = {
  CRITICAL: 'red', HIGH: 'orange', MEDIUM: 'yellow', LOW: 'gray',
};

const severityBg: Record<string, string> = {
  CRITICAL: 'border-red-200 bg-red-50', HIGH: 'border-orange-200 bg-orange-50',
  MEDIUM: 'border-amber-200 bg-amber-50', LOW: 'border-gray-200 bg-gray-50',
};

const suggestedQuestions = [
  'Who is overloaded?',
  'Which department has the lowest attendance?',
  'Who is best suited for a React project?',
  'What skills are missing in our organization?',
  'Who are the top performers this quarter?',
];

interface Message { role: 'user' | 'assistant'; text: string }

export default function AIInsightsPage() {
  const [insights, setInsights] = useState<WorkforceInsight[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: 'Hello! I\'m your HR Copilot. Ask me anything about your workforce — performance, attendance, skills, or workload.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { getInsights().then(setInsights); }, []);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const ask = async (question: string) => {
    if (!question.trim()) return;
    setMessages(m => [...m, { role: 'user', text: question }]);
    setInput('');
    setLoading(true);
    const { answer } = await askWorkforceQuestion(question);
    setMessages(m => [...m, { role: 'assistant', text: answer }]);
    setLoading(false);
  };

  return (
    <div>
      <PageHeader title="AI Insights" description="Workforce intelligence powered by your HR data" />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Insights panel */}
        <div className="lg:col-span-2 space-y-3">
          <p className="text-sm font-semibold text-gray-700">Active Insights</p>
          {insights.map(insight => (
            <div key={insight.id} className={clsx('rounded-xl border p-4', severityBg[insight.severity])}>
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2 text-gray-700">
                  {insightIcon[insight.type]}
                  <p className="text-sm font-semibold">{insight.title}</p>
                </div>
                <Badge variant={severityBadge[insight.severity] ?? 'gray'}>{insight.severity}</Badge>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{insight.description}</p>
            </div>
          ))}
        </div>

        {/* Copilot */}
        <Card className="lg:col-span-3 flex flex-col" style={{ height: '520px' }}>
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100 mb-3">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Sparkles size={14} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">HR Copilot</p>
              <p className="text-xs text-gray-400">Powered by workforce data</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {messages.map((m, i) => (
              <div key={i} className={clsx('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
                <div className={clsx('max-w-xs lg:max-w-sm rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
                  m.role === 'user' ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                )}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-2.5">
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => <div key={i} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggested questions */}
          <div className="flex flex-wrap gap-1.5 py-2 border-t border-gray-100 mt-2">
            {suggestedQuestions.slice(0, 3).map(q => (
              <button key={q} onClick={() => ask(q)} className="text-xs bg-gray-50 hover:bg-indigo-50 hover:text-indigo-700 text-gray-600 border border-gray-200 rounded-full px-2.5 py-1 transition-colors">
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2 mt-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && ask(input)}
              placeholder="Ask anything about your workforce..."
              className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Button onClick={() => ask(input)} disabled={!input.trim() || loading} size="sm">
              <Send size={14} />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
