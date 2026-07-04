import React, { type ReactNode } from 'react';
import { clsx } from 'clsx';

interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  className?: string;
}

export function Table<T>({ columns, data, keyExtractor, className }: TableProps<T>) {
  return (
    <div className={clsx('overflow-x-auto', className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-black">
            {columns.map(col => (
              <th key={col.key} className={clsx('px-5 py-3 text-left text-[10px] font-black text-black/50 uppercase tracking-widest', col.className)}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={keyExtractor(row)} className="border-b border-black/10 hover:bg-[#fce4ec]/30 transition-colors">
              {columns.map(col => (
                <td key={col.key} className={clsx('px-5 py-3.5', col.className)}>
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
