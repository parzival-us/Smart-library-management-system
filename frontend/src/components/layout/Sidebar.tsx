import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiUsers, FiBookOpen, FiClock, FiDollarSign } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';

const Sidebar = () => {
  const { isAdmin, isStaff } = useAuth();
  
  if (!isStaff) return null;

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: <FiHome /> },
    { name: 'Manage Books', path: '/admin/books', icon: <FiBookOpen /> },
    { name: 'Manage Users', path: '/admin/users', icon: <FiUsers />, adminOnly: true },
    { name: 'All Loans', path: '/admin/loans', icon: <FiClock /> },
  ];

  const visibleLinks = links.filter(link => !link.adminOnly || isAdmin);

  return (
    <aside className="w-64 fixed left-0 top-16 h-[calc(100vh-4rem)] glass border-r border-white/10 hidden lg:block overflow-y-auto">
      <div className="py-6 px-4 space-y-2">
        <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
          Administration
        </p>
        {visibleLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) => `
              flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all
              ${isActive 
                ? 'bg-gradient-to-r from-indigo-500/20 to-violet-500/20 text-indigo-300 border border-indigo-500/30 shadow-inner' 
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }
            `}
          >
            <span className="mr-3 text-lg">{link.icon}</span>
            {link.name}
          </NavLink>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
