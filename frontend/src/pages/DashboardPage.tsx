import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { adminApi } from '@/api/admin';
import { circulationApi } from '@/api/circulation';
import { DashboardStats, Loan, Fine } from '@/types';
import StatsCard from '@/components/ui/StatsCard';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import PageHeader from '@/components/ui/PageHeader';
import { FiActivity, FiArrowUpRight, FiBook, FiCalendar, FiClock, FiDollarSign, FiUsers } from 'react-icons/fi';
import Spinner from '@/components/ui/Spinner';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

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
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Books" value={stats?.total_books || 0} icon={<FiBook size={24} />} className="stagger-1" />
        <StatsCard title="Total Users" value={stats?.total_users || 0} icon={<FiUsers size={24} />} className="stagger-2" />
        <StatsCard title="Active Loans" value={stats?.active_loans || 0} icon={<FiClock size={24} />} className="stagger-3" />
        <StatsCard title="Overdue Loans" value={stats?.overdue_loans || 0} icon={<FiActivity size={24} />} className="stagger-4" />
      </div>
      
      <div className="stagger-5 mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="overflow-hidden">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="section-kicker mb-2">Workspace</p>
              <h3 className="text-lg font-semibold text-white">Quick actions</h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-400/15 bg-indigo-500/10 text-indigo-300"><FiActivity /></div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/admin/books">
              <Button icon={<FiBook />}>Manage books</Button>
            </Link>
            <Link to="/admin/users">
              <Button variant="secondary" icon={<FiUsers />}>Manage users</Button>
            </Link>
          </div>
        </Card>
        
        <Card className="overflow-hidden">
          <p className="section-kicker mb-2">Collections</p>
          <h3 className="mb-4 text-lg font-semibold text-white">Fines summary</h3>
          <div className="flex items-center justify-between rounded-xl border border-emerald-400/10 bg-emerald-500/[0.06] p-4">
            <div className="flex items-center text-emerald-400">
              <div className="mr-4 rounded-xl bg-emerald-500/15 p-3">
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
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <StatsCard title="Active Loans" value={activeLoans.length} icon={<FiBook size={24} />} className="stagger-1" />
          <StatsCard title="Total Fines" value={`$${totalUnpaid.toFixed(2)}`} icon={<FiDollarSign size={24} />} className="stagger-2" />
        </div>

        <div className="stagger-3 mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="section-kicker mb-2">Reading now</p>
                  <h3 className="text-lg font-semibold text-white">Recent loans</h3>
                </div>
                <Link to="/my-loans" className="flex items-center gap-1 text-sm font-medium text-indigo-300 transition-colors hover:text-indigo-200">View all <FiArrowUpRight size={15} /></Link>
              </div>
              
              {activeLoans.length === 0 ? (
                <p className="text-slate-400 py-4">You have no active loans right now.</p>
              ) : (
                <div className="space-y-3">
                  {activeLoans.slice(0, 3).map(loan => (
                    <div key={loan.id} className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-slate-950/45 p-3.5">
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
              <p className="section-kicker mb-2">Keep exploring</p>
              <h3 className="mb-4 text-lg font-semibold text-white">Quick links</h3>
              <div className="flex flex-col space-y-3">
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
    <div className="space-y-7">
      <PageHeader
        eyebrow={isStaff ? 'Library command center' : 'Your reading space'}
        title={<>{getGreeting()}, <span className="gradient-text">{user?.full_name?.split(' ')[0]}</span>.</>}
        description={isStaff ? 'Here is a live view of your collection, members, and lending activity.' : 'Everything you need for your next chapter is right here.'}
        aside={
          <div className="hidden items-center gap-3 rounded-xl border border-white/[0.08] bg-slate-950/45 px-4 py-3 sm:flex">
            <FiCalendar className="text-indigo-300" />
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.1em] text-slate-500">Today</p>
              <p className="text-sm font-semibold text-slate-200">{new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date())}</p>
            </div>
          </div>
        }
        actions={
          <Link to={isStaff ? '/admin/books' : '/catalog'}>
            <Button size="sm" icon={isStaff ? <FiBook /> : <FiArrowUpRight />}>{isStaff ? 'Manage collection' : 'Explore catalog'}</Button>
          </Link>
        }
      />

      {isStaff ? renderAdminDashboard() : renderStudentDashboard()}
    </div>
  );
};

export default DashboardPage;
