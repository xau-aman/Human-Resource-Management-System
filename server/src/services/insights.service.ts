import { GoogleGenerativeAI } from '@google/generative-ai';
import prisma from '../config/prisma';
import { config } from '../config/env';
import { buildWorkforceContext } from './workforce-context.service';
import { AppError } from '../utils/AppError';

let genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI | null {
  if (!config.gemini.apiKey) return null;
  if (!genAI) genAI = new GoogleGenerativeAI(config.gemini.apiKey);
  return genAI;
}

const SYSTEM_PROMPT = `You are an intelligent HR Copilot for WorkZen HRMS. 
You analyze workforce data and provide concise, actionable insights.
Always respond in 2-4 sentences. Be specific with names and numbers from the context.
Format: Direct answer first, then recommendation if applicable.`;

const mockResponses: Record<string, string> = {
  overload: '🔴 Based on project assignments, Arjun Sharma (Engineering) has 3 active projects at 120% capacity. Recommend redistributing 1 project to Sneha Iyer who has 30% bandwidth available.',
  attendance: '📊 Today\'s attendance rate is 83%. Marketing has the lowest rate at 78%. Recommend a check-in with the Marketing team lead.',
  react: '✅ Best candidates for a React project: Priya Patel (Expert), Arjun Sharma (Advanced), Sneha Iyer (Intermediate). Priya is currently available.',
  skill: '⚠️ Top skill gaps: AWS Cloud (only 1/5 engineers), Python (2/12 employees), Project Management (3/12). Recommend upskilling budget for AWS certification.',
  performance: '🏆 Top performers this quarter: Ananya Reddy (91%), Arjun Sharma (88.5%), Aditya Joshi (84%). Ananya is ready for a senior role.',
  leave: '📅 3 leave requests pending approval. Vikram Nair (2 days casual) and Rahul Verma (4 days paid) are from Engineering — check sprint capacity before approving.',
  default: 'I can analyze your workforce data. Try: "Who is overloaded?", "Attendance trends?", "Top performers?", "Skill gaps?", or "Pending leaves?"',
};

function getMockResponse(question: string): string {
  const q = question.toLowerCase();
  if (q.includes('overload') || q.includes('busy') || q.includes('capacity')) return mockResponses.overload;
  if (q.includes('attendance') || q.includes('absent') || q.includes('present')) return mockResponses.attendance;
  if (q.includes('react') || q.includes('project') || q.includes('suited')) return mockResponses.react;
  if (q.includes('skill') || q.includes('missing') || q.includes('gap')) return mockResponses.skill;
  if (q.includes('performance') || q.includes('top') || q.includes('best')) return mockResponses.performance;
  if (q.includes('leave') || q.includes('pending') || q.includes('approval')) return mockResponses.leave;
  return mockResponses.default;
}

export async function askWorkforceQuestion(question: string): Promise<{ question: string; answer: string; confidence: number; source: 'ai' | 'mock' }> {
  const ai = getGenAI();

  if (!ai) {
    // No API key — use mock
    return { question, answer: getMockResponse(question), confidence: 0.7, source: 'mock' };
  }

  try {
    const context = await buildWorkforceContext();
    const contextStr = JSON.stringify(context, null, 2);

    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `${SYSTEM_PROMPT}

Current Workforce Data:
${contextStr}

HR Manager's Question: ${question}

Answer:`;

    const result = await model.generateContent(prompt);
    const answer = result.response.text().trim();

    return { question, answer, confidence: 0.95, source: 'ai' };
  } catch (err) {
    console.error('Gemini error:', err);
    // Fallback to mock on API error
    return { question, answer: getMockResponse(question), confidence: 0.7, source: 'mock' };
  }
}

export async function generateAutoInsights(): Promise<void> {
  const ai = getGenAI();
  if (!ai) return;

  try {
    const context = await buildWorkforceContext();
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `${SYSTEM_PROMPT}

Workforce Data: ${JSON.stringify(context)}

Generate 3 workforce insights as JSON array. Each insight must have:
- type: one of WORKLOAD_RISK, SKILL_GAP, PERFORMANCE_OPPORTUNITY, ATTENDANCE_RISK
- severity: one of LOW, MEDIUM, HIGH, CRITICAL
- title: short title (max 8 words)
- description: 1-2 sentences with specific data

Return ONLY valid JSON array, no markdown.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim().replace(/```json|```/g, '');
    const insights = JSON.parse(text) as { type: string; severity: string; title: string; description: string }[];

    for (const insight of insights) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await prisma.workforceInsight.create({
        data: {
          type: insight.type as any,
          severity: insight.severity as any,
          title: insight.title,
          description: insight.description,
          employeeIds: [],
        },
      });
    }
  } catch (err) {
    console.error('Auto-insight generation failed:', err);
  }
}

export async function getInsights() {
  return prisma.workforceInsight.findMany({
    where: { isResolved: false },
    orderBy: [{ severity: 'desc' }, { createdAt: 'desc' }],
    take: 10,
  });
}

export async function resolveInsight(id: string) {
  const insight = await prisma.workforceInsight.findUnique({ where: { id } });
  if (!insight) throw new AppError('Insight not found', 404);
  return prisma.workforceInsight.update({ where: { id }, data: { isResolved: true } });
}
