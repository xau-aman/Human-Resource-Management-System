import React, { type ReactNode } from 'react';
import { Inbox, Loader2, AlertCircle } from 'lucide-react';

export function EmptyState({ title = 'No data found', description = 'Nothing to display here yet.', action }: { title?: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="p-4 bg-gray-50 rounded-full mb-4"><Inbox size={28} className="text-gray-400" /></div>
      <p className="text-sm font-semibold text-gray-700">{title}</p>
      <p className="text-xs text-gray-400 mt-1 max-w-xs">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <Loader2 size={24} className="text-indigo-500 animate-spin" />
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}

export function ErrorState({ message = 'Something went wrong.', onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="p-4 bg-red-50 rounded-full"><AlertCircle size={24} className="text-red-500" /></div>
      <p className="text-sm text-gray-700">{message}</p>
      {onRetry && <button onClick={onRetry} className="text-xs text-indigo-600 hover:underline">Try again</button>}
    </div>
  );
}

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
