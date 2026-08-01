import client from './client';
import { DashboardStats, User } from '@/types';

export const adminApi = {
  getDashboardStats: async () => {
    const response = await client.get<DashboardStats>('/admin/stats');
    return response.data;
  },
  
  getUsers: async (params?: any) => {
    const response = await client.get<User[]>('/admin/users', { params });
    return response.data;
  },
  
  updateUser: async (id: string, data: Partial<User>) => {
    const response = await client.put<User>(`/admin/users/${id}`, data);
    return response.data;
  }
};
