import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { FiMenu, FiX, FiUser, FiLogOut, FiBookOpen, FiSettings, FiChevronDown } from 'react-icons/fi';
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
    { name: 'My Fines', path: '/my-fines', show: isAuthenticated && !isStaff },
    { name: 'Manage Books', path: '/admin/books', show: isStaff },
    { name: 'Manage Users', path: '/admin/users', show: isStaff && user?.role === 'ADMIN' },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <nav className="fixed top-0 z-40 w-full border-b border-white/[0.08] bg-slate-950/75 shadow-[0_12px_32px_-24px_rgba(2,6,23,0.9)] backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <Link to="/" className="group flex flex-shrink-0 items-center space-x-2.5" aria-label="Smart Library home">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-300/25 bg-gradient-to-br from-indigo-400 to-violet-600 text-white shadow-lg shadow-indigo-500/30 transition-transform duration-300 group-hover:rotate-[-6deg] group-hover:scale-105">
              <FiBookOpen size={18} />
            </div>
            <span className="hidden text-lg font-bold tracking-[-0.035em] text-white sm:block">
              Smart<span className="text-indigo-300">Library</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center space-x-1 md:flex">
            {navLinks.filter(l => l.show).map(link => (
              <Link
                key={link.name}
                to={link.path}
                className={`nav-link px-3 py-2 text-sm font-medium transition-colors lg:px-4 ${
                  isActive(link.path)
                    ? 'nav-link--active rounded-lg bg-white/[0.07] text-white'
                    : 'rounded-lg text-slate-400 hover:bg-white/[0.045] hover:text-slate-100'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* User Menu / Auth Buttons */}
          <div className="hidden items-center space-x-4 md:flex">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-expanded={dropdownOpen}
                  aria-haspopup="menu"
                  className="flex items-center space-x-2.5 rounded-full border border-transparent p-1 pr-3 transition-colors hover:border-white/[0.1] hover:bg-white/[0.045]"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-indigo-400/20 bg-indigo-500/10 text-indigo-300">
                    <FiUser />
                  </div>
                  <span className="text-sm font-medium text-slate-200">
                    {user?.full_name?.split(' ')[0]}
                  </span>
                  <FiChevronDown size={14} className={`text-slate-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)}></div>
                    <div className="absolute right-0 z-50 mt-2 w-56 origin-top-right overflow-hidden rounded-2xl border border-white/[0.1] bg-slate-950/95 py-2 shadow-2xl shadow-black/40 backdrop-blur-2xl animate-fade-in" role="menu">
                      <div className="px-4 py-2 border-b border-white/10 mb-2">
                        <p className="text-sm font-medium text-white truncate">{user?.full_name}</p>
                        <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                      </div>
                      <Link to="/dashboard" className="block px-4 py-2 text-sm text-slate-300 transition-colors hover:bg-white/[0.07] hover:text-white" onClick={() => setDropdownOpen(false)} role="menuitem">
                        <div className="flex items-center"><FiSettings className="mr-2" /> Dashboard</div>
                      </Link>
                      <button
                        onClick={() => { logout(); setDropdownOpen(false); }}
                        className="block w-full px-4 py-2 text-left text-sm text-rose-400 transition-colors hover:bg-rose-500/10"
                        role="menuitem"
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
              className="rounded-xl p-2 text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-white"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-white/[0.08] bg-slate-950/95 px-3 pb-4 pt-3 backdrop-blur-2xl animate-slide-down md:hidden">
          <div className="space-y-1">
            {navLinks.filter(l => l.show).map(link => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block rounded-xl px-3 py-2.5 text-sm font-medium ${
                  isActive(link.path) ? 'bg-indigo-500/15 text-indigo-200' : 'text-slate-300 hover:bg-white/[0.05] hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {!isAuthenticated && (
              <div className="mt-4 flex flex-col space-y-2 px-1">
                <Button variant="outline" fullWidth onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}>Sign in</Button>
                <Button variant="primary" fullWidth onClick={() => { navigate('/register'); setMobileMenuOpen(false); }}>Register</Button>
              </div>
            )}
            {isAuthenticated && (
              <div className="mt-4 border-t border-white/[0.08] pt-3">
                <div className="mb-2 px-3 text-xs text-slate-500">Signed in as {user?.full_name}</div>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="block w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium text-rose-400 hover:bg-rose-500/10"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
