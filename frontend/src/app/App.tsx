import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';

import MainLayout from '@/components/layout/MainLayout';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import CatalogPage from '@/pages/CatalogPage';
import BookDetailPage from '@/pages/BookDetailPage';
import MyLoansPage from '@/pages/MyLoansPage';
import ProtectedRoute from '@/app/ProtectedRoute';

import AdminUsersPage from '@/pages/AdminUsersPage';
import AdminBooksPage from '@/pages/AdminBooksPage';
import NotFoundPage from '@/pages/NotFoundPage';
import MyFinesPage from '@/pages/MyFinesPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route element={<MainLayout><Outlet /></MainLayout>}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Public/Authenticated catalog */}
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/books/:id" element={<BookDetailPage />} />
            
            {/* Protected Student/General routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/my-loans" element={<MyLoansPage />} />
              <Route path="/my-fines" element={<MyFinesPage />} />
            </Route>

            {/* Protected Admin/Librarian routes */}
            <Route element={<ProtectedRoute requiredRoles={['ADMIN']} />}>
              <Route path="/admin/users" element={<AdminUsersPage />} />
            </Route>
            
            <Route element={<ProtectedRoute requiredRoles={['ADMIN', 'LIBRARIAN']} />}>
              <Route path="/admin/books" element={<AdminBooksPage />} />
            </Route>
            
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#f8fafc',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
          }
        }}
      />
    </AuthProvider>
  );
}



export default App;
