import client from './client';
import { Loan, Reservation, Fine } from '@/types';

export const circulationApi = {
  borrowBook: async (copyId: string) => {
    const response = await client.post<Loan>('/loans', { copy_id: copyId });
    return response.data;
  },
  
  returnBook: async (loanId: string) => {
    const response = await client.put<Loan>(`/loans/${loanId}/return`);
    return response.data;
  },
  
  getMyLoans: async () => {
    const response = await client.get<Loan[]>('/loans/my');
    return response.data;
  },
  
  getAllLoans: async (params?: any) => {
    const response = await client.get<Loan[]>('/loans', { params });
    return response.data;
  },
  
  createReservation: async (bookId: string) => {
    const response = await client.post<Reservation>('/reservations', { book_id: bookId });
    return response.data;
  },
  
  getMyReservations: async () => {
    const response = await client.get<Reservation[]>('/reservations/my');
    return response.data;
  },
  
  getMyFines: async () => {
    const response = await client.get<Fine[]>('/fines/my');
    return response.data;
  },
  
  payFine: async (fineId: string) => {
    const response = await client.put<Fine>(`/fines/${fineId}/pay`);
    return response.data;
  }
};
