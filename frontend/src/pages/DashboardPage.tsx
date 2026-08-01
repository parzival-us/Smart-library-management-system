import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { adminApi } from '@/api/admin';
import { circulationApi } from '@/api/circulation';
import { DashboardStats, Loan, Fine } from '@/types';
import StatsCard from '@/components/ui/StatsCard';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { FiBook, FiUsers, FiClock, FiAlertCircle, FiDollarSign } from 'react-icons/fi';
import Spinner from '@/components/ui/Spinner';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';

const DashboardPage = () => {
  const { user, isStaff } = useAuth();
  const [loading, setLoading] = useState(true);
  
  // Admin stats
  const [stats, setStats] = useState<DashboardStats | null>(null);
  
  // Student stats
  const [myLoans, setMyLoans] = useState<Loan[]>([]);
  const [myFines, setMyFines] = useState<Fine[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        if (isStaff) {
          const data = await adminApi.getDashboardStats();
          setStats(data);
        } else {
          const [loans, fines] = await Promise.all([
            circulationApi.getMyLoans(),
            circulationApi.getMyFines()
          ]);
          setMyLoans(loans);
          setMyFines(fines);
        }
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isStaff]);

  if (loading) {
    return <div className="h-[60vh] flex items-center justify-center"><Spinner size="lg" /></div>;
  }

  const renderAdminDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Books" value={stats?.total_books || 0} icon={<FiBook size={24} />} className="stagger-1" />
        <StatsCard title="Total Users" value={stats?.total_users || 0} icon={<FiUsers size={24} />} className="stagger-2" />
        <StatsCard title="Active Loans" value={stats?.active_loans || 0} icon={<FiClock size={24} />} className="stagger-3" />
        <StatsCard title="Overdue Loans" value={stats?.overdue_loans || 0} icon={<FiAlertCircle size={24} />} className="stagger-4" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 stagger-5">
        <Card title="Quick Actions">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-4">
            <Link to="/admin/books">
              <Button icon={<FiBook />}>Manage Books</Button>
            </Link>
            <Link to="/admin/users">
              <Button variant="secondary" icon={<FiUsers />}>Manage Users</Button>
            </Link>
          </div>
        </Card>
        
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Fines Summary</h3>
          <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-white/5">
            <div className="flex items-center text-emerald-400">
              <div className="p-3 bg-emerald-500/20 rounded-full mr-4">
                <FiDollarSign size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-400">Total Collected</p>
                <p className="text-2xl font-bold">${stats?.total_fines_collected?.toFixed(2) || '0.00'}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderStudentDashboard = () => {
    const activeLoans = myLoans.filter(l => l.status === 'ACTIVE');
    const unpaidFines = myFines.filter(f => !f.is_paid);
    const totalUnpaid = unpaidFines.reduce((sum, fine) => sum + fine.amount, 0);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard title="Active Loans" value={activeLoans.length} icon={<FiBook size={24} />} className="stagger-1" />
          <StatsCard title="Total Fines" value={`$${totalUnpaid.toFixed(2)}`} icon={<FiDollarSign size={24} />} className="stagger-2" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8 stagger-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Recent Loans</h3>
                <Link to="/my-loans" className="text-sm text-indigo-400 hover:text-indigo-300">View All</Link>
              </div>
              
              {activeLoans.length === 0 ? (
                <p className="text-slate-400 py-4">You have no active loans right now.</p>
              ) : (
                <div className="space-y-3">
                  {activeLoans.slice(0, 3).map(loan => (
                    <div key={loan.id} className="flex justify-between items-center p-3 rounded-lg bg-slate-900/50 border border-white/5">
                      <div>
                        <p className="font-medium text-slate-200">Copy Barcode: {loan.copy_id.substring(0,8)}</p>
                        <p className="text-xs text-slate-400">Due: {new Date(loan.due_date).toLocaleDateString()}</p>
                      </div>
                      <Badge status={loan.status}>{loan.status}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          <div>
            <Card>
              <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
              <div className="space-y-3 flex flex-col">
                <Link to="/catalog">
                  <Button fullWidth icon={<FiBook />}>Browse Catalog</Button>
                </Link>
                <Link to="/my-loans">
                  <Button variant="secondary" fullWidth icon={<FiClock />}>My Loans</Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome, <span className="gradient-text">{user?.full_name?.split(' ')[0]}</span>
        </h1>
        <p className="text-slate-400">Here's what's happening with your account today.</p>
      </div>

      {isStaff ? renderAdminDashboard() : renderStudentDashboard()}
    </div>
  );
};

export default DashboardPage;
