import React, { useEffect, useState, useRef } from 'react';
import { Send, Sparkles, TrendingUp, Users, Clock, CheckCircle, RefreshCw, Zap } from 'lucide-react';
import type { WorkforceInsight } from '../../types';
import { Card, PageHeader, Badge, Button } from '../../components/ui';
import { clsx } from 'clsx';
import { api } from '../../config/api';

// TODO[AI-INSIGHTS]: Gemini API connected via backend — extend prompt engineering here

const insightIcon: Record<string, React.ReactNode> = {
  WORKLOAD_RISK: <Users size={15} />,
  SKILL_GAP: <TrendingUp size={15} />,
  PERFORMANCE_OPPORTUNITY: <Sparkles size={15} />,
  ATTENDANCE_RISK: <Clock size={15} />,
};

const severityBadge: Record<string, 'red' | 'orange' | 'yellow' | 'gray'> = {
  CRITICAL: 'red', HIGH: 'orange', MEDIUM: 'yellow', LOW: 'gray',
};

const severityBg: Record<string, string> = {
  CRITICAL: 'border-red-200 bg-red-50',
  HIGH: 'border-orange-200 bg-orange-50',
  MEDIUM: 'border-amber-200 bg-amber-50',
  LOW: 'border-gray-200 bg-gray-50',
};

const suggestedQuestions = [
  'Who is overloaded?',
  'Which department has the lowest attendance?',
  'Who is best suited for a React project?',
  'What skills are missing?',
  'Who are the top performers?',
];

interface Message {
  role: 'user' | 'assistant';
  text: string;
  source?: 'ai' | 'mock';
}

interface AskResponse {
  data: { question: string; answer: string; confidence: number; source: 'ai' | 'mock' };
}

interface InsightsResponse {
  data: WorkforceInsight[];
}

export default function AIInsightsPage() {
  const [insights, setInsights] = useState<WorkforceInsight[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: 'Hello! I\'m your HR Copilot powered by Gemini AI. Ask me anything about your workforce.', source: 'ai' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const loadInsights = () => {
    api.get<InsightsResponse>('/insights')
      .then(res => setInsights(res.data))
      .catch(() => {});
  };

  useEffect(() => { loadInsights(); }, []);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const ask = async (question: string) => {
    if (!question.trim()) return;
    setMessages(m => [...m, { role: 'user', text: question }]);
    setInput('');
    setLoading(true);
    try {
      const res = await api.post<AskResponse>('/insights/ask', { question });
      setMessages(m => [...m, { role: 'assistant', text: res.data.answer, source: res.data.source }]);
    } catch {
      setMessages(m => [...m, { role: 'assistant', text: 'Unable to process your question right now. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id: string) => {
    await api.patch(`/insights/${id}/resolve`).catch(() => {});
    setInsights(prev => prev.filter(i => i.id !== id));
  };

  const handleGenerate = async () => {
    setGenerating(true);
    await api.post('/insights/generate', {}).catch(() => {});
    loadInsights();
    setGenerating(false);
  };

  return (
    <div>
      <PageHeader
        title="AI Insights"
        description="Workforce intelligence powered by Gemini AI"
        action={
          <Button variant="secondary" size="sm" onClick={handleGenerate} loading={generating}>
            <RefreshCw size={13} /> Generate Insights
          </Button>
        }
      />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Insights panel */}
        <div className="lg:col-span-2 space-y-3">
          <p className="text-sm font-semibold text-gray-700">Active Insights ({insights.length})</p>
          {insights.length === 0 && (
            <div className="text-center py-8 text-sm text-gray-400">No active insights. Click "Generate Insights" to analyze workforce.</div>
          )}
          {insights.map(insight => (
            <div key={insight.id} className={clsx('rounded-xl border p-4', severityBg[insight.severity])}>
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2 text-gray-700">
                  {insightIcon[insight.type]}
                  <p className="text-sm font-semibold">{insight.title}</p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <Badge variant={severityBadge[insight.severity] ?? 'gray'}>{insight.severity}</Badge>
                  <button onClick={() => handleResolve(insight.id)} className="p-1 rounded hover:bg-white/60 text-gray-400 hover:text-emerald-600 transition-colors" title="Mark resolved">
                    <CheckCircle size={14} />
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{insight.description}</p>
            </div>
          ))}
        </div>

        {/* Copilot */}
        <Card className="lg:col-span-3 flex flex-col" style={{ height: '540px' }}>
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100 mb-3">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Sparkles size={14} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">HR Copilot</p>
              <p className="text-xs text-gray-400">Gemini AI · Workforce Context</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <Zap size={10} /> Live
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {messages.map((m, i) => (
              <div key={i} className={clsx('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
                <div className={clsx('max-w-xs lg:max-w-sm rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
                  m.role === 'user' ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                )}>
                  {m.text}
                  {m.source && m.role === 'assistant' && (
                    <span className={clsx('block text-xs mt-1 opacity-60', m.source === 'ai' ? 'text-indigo-600' : 'text-gray-500')}>
                      {m.source === 'ai' ? '✦ Gemini AI' : '◎ Mock'}
                    </span>
                  )}
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

          <div className="flex flex-wrap gap-1.5 py-2 border-t border-gray-100 mt-2">
            {suggestedQuestions.slice(0, 3).map(q => (
              <button key={q} onClick={() => ask(q)}
                className="text-xs bg-gray-50 hover:bg-indigo-50 hover:text-indigo-700 text-gray-600 border border-gray-200 rounded-full px-2.5 py-1 transition-colors">
                {q}
              </button>
            ))}
          </div>

          <div className="flex gap-2 mt-2">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && ask(input)}
              placeholder="Ask anything about your workforce..."
              className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <Button onClick={() => ask(input)} disabled={!input.trim() || loading} size="sm">
              <Send size={14} />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
