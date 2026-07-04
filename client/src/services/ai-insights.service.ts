import type { WorkforceInsight } from '../types';
import { mockInsights } from '../data/insights.data';

// TODO[AI-INSIGHTS]: Replace with real API calls to /api/v1/insights

const mockResponses: Record<string, string> = {
  overloaded: '🔴 Arjun Sharma and Priya Patel in Engineering are currently at 120%+ capacity. Consider redistributing 3-4 tasks to Sneha Iyer who has 30% bandwidth available.',
  attendance: '📊 Marketing has the lowest attendance at 78% this month. Engineering leads at 91%. Recommend a check-in with the Marketing team lead.',
  react: '✅ Best candidates for a React project: Priya Patel (Expert), Arjun Sharma (Advanced), Sneha Iyer (Intermediate). Priya is available from Jan 6.',
  skills: '⚠️ Top skill gaps: AWS Cloud (4 engineers needed), Python (2 developers), Project Management (3 team leads). Recommend upskilling budget allocation.',
  performance: '🏆 Top performers this quarter: Ananya Reddy (91.0), Arjun Sharma (88.5), Aditya Joshi (84.0). Ananya is ready for a senior role.',
  default: 'I can help you analyze your workforce. Try asking: "Who is overloaded?", "Which department has lowest attendance?", "Who is best for a React project?", or "What skills are missing?"',
};

export async function getInsights(): Promise<WorkforceInsight[]> {
  return mockInsights;
}

export async function askWorkforceQuestion(question: string): Promise<{ question: string; answer: string; confidence: number }> {
  // TODO[AI-INSIGHTS]: Connect workforce intelligence engine
  const q = question.toLowerCase();
  let answer = mockResponses.default;
  if (q.includes('overload') || q.includes('busy') || q.includes('capacity')) answer = mockResponses.overloaded;
  else if (q.includes('attendance') || q.includes('absent') || q.includes('present')) answer = mockResponses.attendance;
  else if (q.includes('react') || q.includes('project') || q.includes('suited')) answer = mockResponses.react;
  else if (q.includes('skill') || q.includes('missing') || q.includes('gap')) answer = mockResponses.skills;
  else if (q.includes('performance') || q.includes('top') || q.includes('best')) answer = mockResponses.performance;

  return { question, answer, confidence: 0.85 };
}
