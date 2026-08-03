import { useState, useEffect } from 'react';
import { circulationApi } from '@/api/circulation';
import { Loan } from '@/types';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';
import { FiBookOpen } from 'react-icons/fi';
import DataTable, { Column } from '@/components/ui/DataTable';
import PageHeader from '@/components/ui/PageHeader';

const MyLoansPage = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'RETURNED'>('ACTIVE');

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const data = await circulationApi.getMyLoans();
        setLoans(data);
      } catch (error) {
        console.error('Failed to fetch loans', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLoans();
  }, []);

  const filteredLoans = loans.filter(loan => {
    if (filter === 'ALL') return true;
    if (filter === 'ACTIVE') return loan.status === 'ACTIVE' || loan.status === 'OVERDUE';
    if (filter === 'RETURNED') return loan.status === 'RETURNED';
    return true;
  });

  const columns: Column<Loan>[] = [
    {
      header: 'Book Barcode',
      accessor: 'copy_id',
      render: (loan) => loan.copy_id.substring(0, 8) + '...'
    },
    {
      header: 'Borrowed At',
      accessor: 'borrowed_at',
      render: (loan) => new Date(loan.borrowed_at).toLocaleDateString()
    },
    {
      header: 'Due Date',
      accessor: 'due_date',
      render: (loan) => (
        <span className={new Date(loan.due_date) < new Date() && loan.status !== 'RETURNED' ? 'text-rose-400 font-medium' : ''}>
          {new Date(loan.due_date).toLocaleDateString()}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (loan) => <Badge status={loan.status}>{loan.status}</Badge>
    }
  ];

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Your borrowed titles"
        title={<>Reading, <span className="gradient-text">right on schedule.</span></>}
        description="Keep an eye on your loans, return dates, and reading history."
        aside={
          <div className="hidden rounded-xl border border-white/[0.08] bg-slate-950/45 px-4 py-3 sm:block">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Currently shown</p>
            <p className="mt-1 text-lg font-semibold text-slate-100">{loading ? '—' : filteredLoans.length} loans</p>
          </div>
        }
        actions={
          <div className="flex rounded-xl border border-white/[0.08] bg-slate-950/55 p-1">
          {(['ACTIVE', 'RETURNED', 'ALL'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                filter === f ? 'bg-indigo-500/20 text-indigo-100 shadow-inner' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
          </div>
        }
      />

      {loading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : filteredLoans.length === 0 ? (
        <EmptyState 
          icon={<FiBookOpen />}
          title={`No ${filter !== 'ALL' ? filter.toLowerCase() : ''} loans found`}
          description="You don't have any borrowed books in this category."
        />
      ) : (
        <DataTable columns={columns} data={filteredLoans} />
      )}
    </div>
  );
};

export default MyLoansPage;
