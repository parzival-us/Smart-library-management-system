import { ReactNode } from 'react';

export interface Column<T> {
  header: string;
  accessor: keyof T | string;
  render?: (item: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  className?: string;
}

function DataTable<T>({ columns, data, emptyMessage = 'No data available', className = '' }: DataTableProps<T>) {
  return (
    <div className={`relative overflow-x-auto rounded-2xl border border-white/[0.08] bg-slate-950/40 shadow-[0_18px_50px_-35px_rgba(2,6,23,0.9)] ${className}`}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/[0.08] bg-slate-950/75">
            {columns.map((col, idx) => (
              <th key={idx} className="whitespace-nowrap px-6 py-4 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-slate-400">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, rowIndex) => (
              <tr key={rowIndex} className="group transition-colors hover:bg-indigo-400/[0.045]">
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="whitespace-nowrap px-6 py-4 text-sm text-slate-300">
                    {col.render ? col.render(item) : String(item[col.accessor as keyof T] || '-')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
