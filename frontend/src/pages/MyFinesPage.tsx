import React, { useState, useEffect } from 'react';
import { circulationApi } from '@/api/circulation';
import { Fine } from '@/types';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';
import { FiDollarSign, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const MyFinesPage = () => {
  const [fines, setFines] = useState<Fine[]>([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState<string | null>(null);

  const fetchFines = async () => {
    try {
      const data = await circulationApi.getMyFines();
      setFines(data);
    } catch (error) {
      toast.error('Failed to load fines');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFines();
  }, []);

  const handlePay = async (id: string) => {
    setPayingId(id);
    try {
      await circulationApi.payFine(id);
      toast.success('Payment successful');
      fetchFines();
    } catch (error) {
      toast.error('Payment failed');
    } finally {
      setPayingId(null);
    }
  };

  const totalUnpaid = fines.filter(f => !f.is_paid).reduce((sum, f) => sum + f.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Fines</h1>
          <p className="text-slate-400">View and manage your library fines.</p>
        </div>
        
        <div className="glass px-6 py-3 rounded-xl border-rose-500/30 flex items-center">
          <div className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mr-4">
            <FiAlertCircle size={20} />
          </div>
          <div>
            <p className="text-sm text-slate-400 font-medium">Total Balance</p>
            <p className="text-2xl font-bold text-white">${totalUnpaid.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : fines.length === 0 ? (
        <EmptyState 
          icon={<FiDollarSign />}
          title="No fines found"
          description="You don't have any recorded fines on your account. Great job!"
        />
      ) : (
        <div className="grid gap-4">
          {fines.map((fine) => (
            <Card key={fine.id} className="flex flex-col sm:flex-row sm:items-center justify-between" padding="md">
              <div className="mb-4 sm:mb-0">
                <div className="flex items-center space-x-3 mb-1">
                  <span className="text-xl font-bold text-white">${fine.amount.toFixed(2)}</span>
                  <Badge variant={fine.is_paid ? 'success' : 'danger'}>
                    {fine.is_paid ? 'Paid' : 'Unpaid'}
                  </Badge>
                </div>
                <p className="text-slate-300 font-medium">{fine.reason}</p>
                <p className="text-sm text-slate-500 mt-1">Issued: {new Date(fine.created_at).toLocaleDateString()}</p>
              </div>
              
              {!fine.is_paid && (
                <Button 
                  onClick={() => handlePay(fine.id)}
                  loading={payingId === fine.id}
                  icon={<FiDollarSign />}
                >
                  Pay Now
                </Button>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyFinesPage;
