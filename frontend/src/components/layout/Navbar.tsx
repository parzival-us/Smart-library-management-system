import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { FiMenu, FiX, FiUser, FiLogOut, FiBook, FiSettings } from 'react-icons/fi';
import Button from '../ui/Button';

const Navbar = () => {
  const { user, isAuthenticated, isStaff, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navLinks = [
    { name: 'Catalog', path: '/catalog', show: true },
    { name: 'Dashboard', path: '/dashboard', show: isAuthenticated },
    { name: 'My Loans', path: '/my-loans', show: isAuthenticated && !isStaff },
    { name: 'Admin', path: '/admin/users', show: isStaff },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <nav className="fixed top-0 w-full z-40 glass border-b border-white/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/30">
              L
            </div>
            <span className="text-xl font-bold tracking-tight text-white hidden sm:block">
              Smart<span className="text-indigo-400">Library</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.filter(l => l.show).map(link => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-white/10 text-white'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* User Menu / Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-3 focus:outline-none p-1 rounded-full hover:bg-white/5 transition-colors pr-3 border border-transparent hover:border-white/10"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-white/10 text-indigo-400">
                    <FiUser />
                  </div>
                  <span className="text-sm font-medium text-slate-200">
                    {user?.full_name?.split(' ')[0]}
                  </span>
                </button>

                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-48 glass-card bg-slate-900/95 py-2 z-50 animate-fade-in origin-top-right">
                      <div className="px-4 py-2 border-b border-white/10 mb-2">
                        <p className="text-sm font-medium text-white truncate">{user?.full_name}</p>
                        <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                      </div>
                      <Link to="/dashboard" className="block px-4 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-colors" onClick={() => setDropdownOpen(false)}>
                        <div className="flex items-center"><FiSettings className="mr-2" /> Dashboard</div>
                      </Link>
                      <button
                        onClick={() => { logout(); setDropdownOpen(false); }}
                        className="w-full text-left block px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <div className="flex items-center"><FiLogOut className="mr-2" /> Sign out</div>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex space-x-3">
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Sign in</Button>
                <Button variant="primary" size="sm" onClick={() => navigate('/register')}>Register</Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-300 hover:text-white p-2"
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass border-t border-white/10 animate-slide-down">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.filter(l => l.show).map(link => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.path) ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {!isAuthenticated && (
              <div className="mt-4 px-3 flex flex-col space-y-2">
                <Button variant="outline" fullWidth onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}>Sign in</Button>
                <Button variant="primary" fullWidth onClick={() => { navigate('/register'); setMobileMenuOpen(false); }}>Register</Button>
              </div>
            )}
            {isAuthenticated && (
              <button
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="w-full text-left mt-4 block px-3 py-2 rounded-md text-base font-medium text-rose-400 hover:bg-rose-500/10"
              >
                Sign out
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
