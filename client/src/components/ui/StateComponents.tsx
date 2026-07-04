import React, { type ReactNode } from 'react';
import { Inbox, Loader2, AlertCircle } from 'lucide-react';

export function EmptyState({ title = 'No data found', description = 'Nothing to display here yet.', action }: { title?: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="p-4 bg-[#fce4ec] rounded-2xl mb-4 border-2 border-black">
        <Inbox size={28} className="text-[#C54B8C]" />
      </div>
      <p className="text-sm font-bold text-black">{title}</p>
      <p className="text-xs text-black/40 mt-1 max-w-xs">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <Loader2 size={24} className="text-[#C54B8C] animate-spin" />
      <p className="text-sm text-black/50 font-bold uppercase tracking-wider">{message}</p>
    </div>
  );
}

export function ErrorState({ message = 'Something went wrong.', onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="p-4 bg-red-50 rounded-2xl border-2 border-red-500">
        <AlertCircle size={24} className="text-red-500" />
      </div>
      <p className="text-sm text-black/70 font-bold">{message}</p>
      {onRetry && <button onClick={onRetry} className="text-xs text-[#C54B8C] hover:underline font-bold uppercase">Try again</button>}
    </div>
  );
}

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-black text-black uppercase tracking-tight">{title}</h1>
        {description && <p className="text-sm text-black/40 mt-0.5 font-medium">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
