import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuth } from '@/context/AuthContext';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { isStaff, isAuthenticated } = useAuth();
  
  const showSidebar = isAuthenticated && isStaff;

  return (
    <div className="app-shell">
      <div className="ambient-orb ambient-orb--violet" aria-hidden="true" />
      <div className="ambient-orb ambient-orb--blue" aria-hidden="true" />
      <div className="ambient-orb ambient-orb--rose" aria-hidden="true" />
      <Navbar />
      
      <div className="relative z-10 flex h-full pt-16">
        {showSidebar && <Sidebar />}
        
        <main className={`flex-1 min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 transition-all duration-300 ${showSidebar ? 'lg:ml-64' : ''}`}>
          <div className="mx-auto w-full max-w-7xl animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
