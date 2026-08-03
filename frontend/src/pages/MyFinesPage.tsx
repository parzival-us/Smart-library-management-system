import { useState, useEffect } from 'react';
import { circulationApi } from '@/api/circulation';
import { Fine } from '@/types';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';
import { FiDollarSign, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import PageHeader from '@/components/ui/PageHeader';

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
    <div className="space-y-7">
      <PageHeader
        eyebrow="Account balance"
        title={<>Stay on top of <span className="gradient-text">your account.</span></>}
        description="View outstanding library fines and settle them whenever you are ready."
        aside={
          <div className="flex items-center rounded-xl border border-rose-400/20 bg-rose-500/[0.07] px-4 py-3">
            <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/15 text-rose-300">
            <FiAlertCircle size={20} />
          </div>
          <div>
              <p className="text-xs font-medium uppercase tracking-[0.1em] text-slate-500">Total balance</p>
            <p className="text-2xl font-bold text-white">${totalUnpaid.toFixed(2)}</p>
          </div>
          </div>
        }
      />

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
