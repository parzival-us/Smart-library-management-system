import React, { useState, useEffect } from 'react';
import { circulationApi } from '@/api/circulation';
import { Loan } from '@/types';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';
import { FiClock, FiBookOpen } from 'react-icons/fi';
import DataTable, { Column } from '@/components/ui/DataTable';

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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Loans</h1>
          <p className="text-slate-400">Track your borrowed books and due dates.</p>
        </div>
        
        <div className="flex glass rounded-lg p-1">
          {(['ACTIVE', 'RETURNED', 'ALL'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                filter === f ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

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
