import prisma from '../config/prisma';

// TODO[AI-INSIGHTS]: Connect workforce intelligence engine

const mockResponses: Record<string, string> = {
  overloaded: 'Based on current task assignments, Arjun Sharma and Priya Patel in Engineering have workloads exceeding 120% capacity this sprint.',
  attendance: 'The Marketing department has the lowest attendance rate at 78% this month, followed by Engineering at 85%.',
  react: 'Priya Patel (Advanced), Sneha Iyer (Intermediate), and Arjun Sharma (Advanced) are best suited for a React project.',
  skills: 'Key skill gaps: AWS Cloud (4 engineers needed), Python (2 developers), and Project Management (3 team leads).',
  default: 'I can help you analyze workforce data. Try asking about overloaded employees, attendance trends, skill gaps, or project assignments.',
};

export async function getInsights() {
  return prisma.workforceInsight.findMany({ where: { isResolved: false }, orderBy: { createdAt: 'desc' } });
}

export async function askWorkforceQuestion(question: string): Promise<{ question: string; answer: string; confidence: number }> {
  // TODO[AI-INSIGHTS]: Replace with real LLM/ML inference
  const q = question.toLowerCase();
  let answer = mockResponses.default;
  if (q.includes('overload') || q.includes('busy')) answer = mockResponses.overloaded;
  else if (q.includes('attendance') || q.includes('absent')) answer = mockResponses.attendance;
  else if (q.includes('react') || q.includes('project')) answer = mockResponses.react;
  else if (q.includes('skill') || q.includes('missing') || q.includes('gap')) answer = mockResponses.skills;

  return { question, answer, confidence: 0.85 };
}
