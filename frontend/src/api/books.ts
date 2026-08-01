import client from './client';
import { Book, BookListItem, Category, Author, BookCopy } from '@/types';

export const booksApi = {
  getBooks: async (params?: { search?: string; category_id?: string; skip?: number; limit?: number }) => {
    const response = await client.get<BookListItem[]>('/books/', { params });
    return response.data;
  },
  
  getBook: async (id: string) => {
    const response = await client.get<Book>(`/books/${id}`);
    return response.data;
  },
  
  createBook: async (data: Partial<Book>) => {
    const response = await client.post<Book>('/books/', data);
    return response.data;
  },
  
  updateBook: async (id: string, data: Partial<Book>) => {
    const response = await client.put<Book>(`/books/${id}`, data);
    return response.data;
  },
  
  deleteBook: async (id: string) => {
    const response = await client.delete(`/books/${id}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await client.get<Category[]>('/books/categories/');
    return response.data;
  },
  
  createCategory: async (data: Partial<Category>) => {
    const response = await client.post<Category>('/books/categories/', data);
    return response.data;
  },
  
  getAuthors: async () => {
    const response = await client.get<Author[]>('/books/authors/');
    return response.data;
  },
  
  createAuthor: async (data: Partial<Author>) => {
    const response = await client.post<Author>('/books/authors/', data);
    return response.data;
  },
  
  createCopy: async (data: Partial<BookCopy>) => {
    const response = await client.post<BookCopy>('/books/copies/', data);
    return response.data;
  }
};
