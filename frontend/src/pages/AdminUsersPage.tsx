import { useState, useEffect } from 'react';
import { adminApi } from '@/api/admin';
import { User } from '@/types';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import DataTable, { Column } from '@/components/ui/DataTable';
import Spinner from '@/components/ui/Spinner';
import PageHeader from '@/components/ui/PageHeader';
import toast from 'react-hot-toast';

const AdminUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const data = await adminApi.getUsers();
      setUsers(data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleActive = async (user: User) => {
    try {
      await adminApi.updateUser(user.id, { is_active: !user.is_active });
      toast.success(`User ${user.is_active ? 'deactivated' : 'activated'} successfully`);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleChangeRole = async (user: User, newRole: 'ADMIN' | 'LIBRARIAN' | 'STUDENT') => {
    try {
      await adminApi.updateUser(user.id, { role: newRole });
      toast.success('Role updated successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const columns: Column<User>[] = [
    { header: 'Name', accessor: 'full_name' },
    { header: 'Email', accessor: 'email' },
    { 
      header: 'Role', 
      accessor: 'role',
      render: (user) => (
        <select
          value={user.role}
          onChange={(e) => handleChangeRole(user, e.target.value as any)}
          className="bg-black border border-white/10 rounded px-2 py-1 text-sm text-slate-200 outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="STUDENT" className="bg-black text-white">Student</option>
          <option value="LIBRARIAN" className="bg-black text-white">Librarian</option>
          <option value="ADMIN" className="bg-black text-white">Admin</option>
        </select>
      )
    },
    { 
      header: 'Status', 
      accessor: 'is_active',
      render: (user) => (
        <Badge variant={user.is_active ? 'success' : 'danger'}>
          {user.is_active ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (user) => (
        <button
          onClick={() => handleToggleActive(user)}
          className={`text-sm font-medium ${user.is_active ? 'text-rose-400 hover:text-rose-300' : 'text-emerald-400 hover:text-emerald-300'}`}
        >
          {user.is_active ? 'Deactivate' : 'Activate'}
        </button>
      )
    }
  ];

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Member administration"
        title={<>Your library community, <span className="gradient-text">at a glance.</span></>}
        description="Review member access, update roles, and keep everyone connected to the collection."
        aside={
          <div className="hidden rounded-xl border border-white/[0.08] bg-slate-950/45 px-4 py-3 sm:block">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Members</p>
            <p className="mt-1 text-lg font-semibold text-slate-100">{loading ? '—' : users.length} people</p>
          </div>
        }
      />

      <Card padding="none">
        {loading ? (
          <div className="py-12 flex justify-center"><Spinner /></div>
        ) : (
          <DataTable columns={columns} data={users} />
        )}
      </Card>
    </div>
  );
};

export default AdminUsersPage;
