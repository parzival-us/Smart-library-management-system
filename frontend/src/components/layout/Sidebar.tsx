import { NavLink } from 'react-router-dom';
import { FiHome, FiUsers, FiBookOpen, FiActivity } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';

const Sidebar = () => {
  const { isAdmin, isStaff } = useAuth();
  
  if (!isStaff) return null;

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: <FiHome /> },
    { name: 'Manage Books', path: '/admin/books', icon: <FiBookOpen /> },
    { name: 'Manage Users', path: '/admin/users', icon: <FiUsers />, adminOnly: true },
  ];

  const visibleLinks = links.filter(link => !link.adminOnly || isAdmin);

  return (
    <aside className="fixed left-0 top-16 hidden h-[calc(100vh-4rem)] w-64 overflow-y-auto border-r border-white/[0.08] bg-slate-950/55 backdrop-blur-2xl lg:block">
      <div className="flex min-h-full flex-col px-4 py-6">
        <p className="mb-4 px-4 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          Administration
        </p>
        <div className="space-y-1.5">
          {visibleLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) => `sidebar-link flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                isActive
                  ? 'sidebar-link--active border border-indigo-400/15 bg-gradient-to-r from-indigo-500/15 to-violet-500/10 text-indigo-200 shadow-inner'
                  : 'border border-transparent text-slate-400 hover:bg-white/[0.045] hover:text-slate-200'
              }`}
            >
              <span className="mr-3 text-lg">{link.icon}</span>
              {link.name}
            </NavLink>
          ))}
        </div>

        <div className="mt-auto rounded-2xl border border-indigo-400/10 bg-gradient-to-br from-indigo-500/[0.12] to-violet-500/[0.04] p-4 shadow-inner">
          <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-400/10 text-indigo-300">
            <FiActivity size={16} />
          </div>
          <p className="text-sm font-semibold text-slate-200">Library control</p>
          <p className="mt-1 text-xs leading-5 text-slate-400">Keep the collection organized and ready for every reader.</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
