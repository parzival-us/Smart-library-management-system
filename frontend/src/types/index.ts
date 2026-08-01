export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'ADMIN' | 'LIBRARIAN' | 'STUDENT';
  is_active: boolean;
  created_at: string;
}

export interface Author {
  id: string;
  name: string;
  bio?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface BookCopy {
  id: string;
  book_id: string;
  barcode: string;
  condition: string;
  is_available: boolean;
}

export interface Book {
  id: string;
  isbn: string;
  title: string;
  description?: string;
  published_year?: number;
  cover_image_url?: string;
  category?: Category;
  authors: Author[];
  copies: BookCopy[];
  created_at: string;
}

export interface BookListItem extends Omit<Book, 'copies'> {
  available_copies: number;
}

export interface Loan {
  id: string;
  user_id: string;
  copy_id: string;
  borrowed_at: string;
  due_date: string;
  returned_at?: string;
  status: string;
  book_copy?: BookCopy;
  created_at: string;
}

export interface Reservation {
  id: string;
  user_id: string;
  book_id: string;
  reserved_at: string;
  expires_at: string;
  status: string;
  book?: Book;
  created_at: string;
}

export interface Fine {
  id: string;
  loan_id: string;
  user_id: string;
  amount: number;
  reason: string;
  is_paid: boolean;
  created_at: string;
}

export interface LoginRequest {
  username: string; // for OAuth2 form data
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface DashboardStats {
  total_books: number;
  total_users: number;
  active_loans: number;
  overdue_loans: number;
  total_fines_collected: number;
}
