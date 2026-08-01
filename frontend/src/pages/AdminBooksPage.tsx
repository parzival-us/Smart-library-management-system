import React, { useState, useEffect } from 'react';
import { booksApi } from '@/api/books';
import { BookListItem } from '@/types';
import Card from '@/components/ui/Card';
import DataTable, { Column } from '@/components/ui/DataTable';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';

const AdminBooksPage = () => {
  const [books, setBooks] = useState<BookListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBook, setNewBook] = useState({ title: '', isbn: '' });

  const fetchBooks = async () => {
    try {
      const data = await booksApi.getBooks();
      setBooks(data);
    } catch (error) {
      toast.error('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      await booksApi.deleteBook(id);
      toast.success('Book deleted');
      fetchBooks();
    } catch (error) {
      toast.error('Failed to delete book');
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await booksApi.createBook(newBook);
      toast.success('Book created successfully');
      setIsModalOpen(false);
      setNewBook({ title: '', isbn: '' });
      fetchBooks();
    } catch (error) {
      toast.error('Failed to create book');
    }
  };

  const columns: Column<BookListItem>[] = [
    { header: 'Title', accessor: 'title', render: (b) => <span className="font-medium">{b.title}</span> },
    { header: 'ISBN', accessor: 'isbn' },
    { header: 'Category', accessor: 'category', render: (b) => b.category?.name || '-' },
    { header: 'Available', accessor: 'available_copies' },
    {
      header: 'Actions',
      accessor: 'id',
      render: (book) => (
        <div className="flex items-center space-x-3">
          <button className="text-slate-400 hover:text-indigo-400 transition-colors"><FiEdit2 size={16} /></button>
          <button onClick={() => handleDelete(book.id)} className="text-slate-400 hover:text-rose-400 transition-colors"><FiTrash2 size={16} /></button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Manage Books</h1>
          <p className="text-slate-400">Add, edit, or remove books from the catalog.</p>
        </div>
        <Button icon={<FiPlus />} onClick={() => setIsModalOpen(true)}>Add Book</Button>
      </div>

      <Card padding="none">
        {loading ? (
          <div className="py-12 flex justify-center"><Spinner /></div>
        ) : (
          <DataTable columns={columns} data={books} />
        )}
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Book">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <Input 
            label="Title" 
            value={newBook.title} 
            onChange={e => setNewBook({...newBook, title: e.target.value})} 
            required 
          />
          <Input 
            label="ISBN" 
            value={newBook.isbn} 
            onChange={e => setNewBook({...newBook, isbn: e.target.value})} 
            required 
          />
          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)} type="button">Cancel</Button>
            <Button type="submit">Create Book</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminBooksPage;
