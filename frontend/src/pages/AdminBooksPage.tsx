import React, { useState, useEffect } from 'react';
import { booksApi } from '@/api/books';
import { BookListItem, Category, Author } from '@/types';
import Card from '@/components/ui/Card';
import DataTable, { Column } from '@/components/ui/DataTable';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import PageHeader from '@/components/ui/PageHeader';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiCopy } from 'react-icons/fi';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';

interface BookForm {
  title: string;
  isbn: string;
  description: string;
  published_year: string;
  cover_image_url: string;
  category_id: string;
  author_ids: string[];
}

const emptyForm: BookForm = {
  title: '',
  isbn: '',
  description: '',
  published_year: '',
  cover_image_url: '',
  category_id: '',
  author_ids: [],
};

const AdminBooksPage = () => {
  const [books, setBooks] = useState<BookListItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);

  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [copyBookId, setCopyBookId] = useState<string | null>(null);
  const [copyBarcode, setCopyBarcode] = useState('');
  const [copyCondition, setCopyCondition] = useState('Good');

  const [form, setForm] = useState<BookForm>({ ...emptyForm });
  const [newAuthorName, setNewAuthorName] = useState('');
  const [addingAuthor, setAddingAuthor] = useState(false);

  const handleAddAuthor = async () => {
    const name = newAuthorName.trim();
    if (!name) return;

    // Check if author already exists
    const existing = authors.find((a) => a.name.toLowerCase() === name.toLowerCase());
    if (existing) {
      if (!form.author_ids.includes(existing.id)) {
        updateField('author_ids', [...form.author_ids, existing.id]);
      }
      setNewAuthorName('');
      return;
    }

    // Create new author
    setAddingAuthor(true);
    try {
      const created = await booksApi.createAuthor({ name });
      setAuthors((prev) => [...prev, created]);
      updateField('author_ids', [...form.author_ids, created.id]);
      setNewAuthorName('');
      toast.success(`Author "${name}" added`);
    } catch {
      toast.error('Failed to add author');
    } finally {
      setAddingAuthor(false);
    }
  };

  const removeAuthor = (authorId: string) => {
    updateField('author_ids', form.author_ids.filter((id) => id !== authorId));
  };

  const fetchBooks = async () => {
    try {
      const data = await booksApi.getBooks();
      setBooks(data);
    } catch {
      toast.error('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  const fetchMeta = async () => {
    try {
      const [cats, auths] = await Promise.all([booksApi.getCategories(), booksApi.getAuthors()]);
      setCategories(cats);
      setAuthors(auths);
    } catch {
      // silent
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchMeta();
  }, []);

  const updateField = (field: keyof BookForm, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // ── Add Book ─────────────────────────────────────
  const openAddModal = () => {
    setForm({ ...emptyForm });
    setIsAddModalOpen(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: Record<string, unknown> = { title: form.title, isbn: form.isbn };
      if (form.description) payload.description = form.description;
      if (form.published_year) payload.published_year = parseInt(form.published_year, 10);
      if (form.cover_image_url) payload.cover_image_url = form.cover_image_url;
      if (form.category_id) payload.category_id = form.category_id;
      if (form.author_ids.length > 0) payload.author_ids = form.author_ids;

      await booksApi.createBook(payload);
      toast.success('Book created successfully');
      setIsAddModalOpen(false);
      fetchBooks();
    } catch {
      toast.error('Failed to create book');
    }
  };

  // ── Edit Book ────────────────────────────────────
  const openEditModal = (book: BookListItem) => {
    setEditingBookId(book.id);
    setForm({
      title: book.title,
      isbn: book.isbn,
      description: book.description || '',
      published_year: book.published_year?.toString() || '',
      cover_image_url: book.cover_image_url || '',
      category_id: book.category?.id || '',
      author_ids: book.authors?.map((a) => a.id) || [],
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBookId) return;
    try {
      const payload: Record<string, unknown> = { title: form.title };
      if (form.description) payload.description = form.description;
      if (form.published_year) payload.published_year = parseInt(form.published_year, 10);
      if (form.cover_image_url) payload.cover_image_url = form.cover_image_url;
      if (form.category_id) payload.category_id = form.category_id;
      if (form.author_ids.length > 0) payload.author_ids = form.author_ids;

      await booksApi.updateBook(editingBookId, payload);
      toast.success('Book updated successfully');
      setIsEditModalOpen(false);
      setEditingBookId(null);
      fetchBooks();
    } catch {
      toast.error('Failed to update book');
    }
  };

  // ── Add Copy ─────────────────────────────────────
  const openCopyModal = (bookId: string) => {
    setCopyBookId(bookId);
    setCopyBarcode('');
    setCopyCondition('Good');
    setIsCopyModalOpen(true);
  };

  const handleCopySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!copyBookId) return;
    try {
      await booksApi.createCopy({ book_id: copyBookId, barcode: copyBarcode, condition: copyCondition } as any);
      toast.success('Copy added successfully');
      setIsCopyModalOpen(false);
      fetchBooks();
    } catch {
      toast.error('Failed to add copy');
    }
  };

  // ── Delete Book ──────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      await booksApi.deleteBook(id);
      toast.success('Book deleted');
      fetchBooks();
    } catch {
      toast.error('Failed to delete book');
    }
  };

  // ── Table Columns ────────────────────────────────
  const columns: Column<BookListItem>[] = [
    { header: 'Title', accessor: 'title', render: (b) => <span className="font-medium">{b.title}</span> },
    { header: 'ISBN', accessor: 'isbn' },
    { header: 'Category', accessor: 'category', render: (b) => b.category?.name || '—' },
    {
      header: 'Authors',
      accessor: 'authors' as any,
      render: (b) => b.authors?.map((a) => a.name).join(', ') || '—',
    },
    { header: 'Copies', accessor: 'available_copies' },
    {
      header: 'Actions',
      accessor: 'id',
      render: (book) => (
        <div className="flex items-center space-x-2">
          <button onClick={() => openEditModal(book)} title="Edit book" className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-400/10 transition-all"><FiEdit2 size={15} /></button>
          <button onClick={() => openCopyModal(book.id)} title="Add copy" className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10 transition-all"><FiCopy size={15} /></button>
          <button onClick={() => handleDelete(book.id)} title="Delete book" className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 transition-all"><FiTrash2 size={15} /></button>
        </div>
      ),
    },
  ];

  // ── Inline form fields (NOT a sub-component to prevent focus loss) ──
  const renderBookFormFields = (isEdit: boolean) => (
    <>
      <Input label="Title" value={form.title} onChange={(e) => updateField('title', e.target.value)} required />
      {!isEdit && (
        <Input label="ISBN" value={form.isbn} onChange={(e) => updateField('isbn', e.target.value)} required />
      )}
      <Input label="Description" value={form.description} onChange={(e) => updateField('description', e.target.value)} />
      <Input label="Published Year" type="number" value={form.published_year} onChange={(e) => updateField('published_year', e.target.value)} />
      <Input label="Cover Image URL" value={form.cover_image_url} onChange={(e) => updateField('cover_image_url', e.target.value)} />

      {categories.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Category</label>
          <select
            value={form.category_id}
            onChange={(e) => updateField('category_id', e.target.value)}
            className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
          >
          <option value="" className="bg-black text-white">— None —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id} className="bg-black text-white">{c.name}</option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">Authors</label>

        {/* Selected authors as removable tags */}
        {form.author_ids.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {form.author_ids.map((id) => {
              const author = authors.find((a) => a.id === id);
              return author ? (
                <span key={id} className="inline-flex items-center gap-1 bg-indigo-500/20 text-indigo-300 text-xs font-medium px-2.5 py-1 rounded-full border border-indigo-500/30">
                  {author.name}
                  <button type="button" onClick={() => removeAuthor(id)} className="hover:text-white transition-colors">
                    &times;
                  </button>
                </span>
              ) : null;
            })}
          </div>
        )}

        {/* Type author name + Add button */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newAuthorName}
            onChange={(e) => setNewAuthorName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddAuthor(); } }}
            placeholder="Type author name..."
            className="flex-1 bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder:text-slate-500"
          />
          <Button type="button" variant="secondary" onClick={handleAddAuthor} loading={addingAuthor} className="shrink-0">
            Add
          </Button>
        </div>
        <p className="text-xs text-slate-500 mt-1">Type a name and press Enter or click Add. New authors are created automatically.</p>
      </div>
    </>
  );

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Catalog administration"
        title={<>Keep the collection <span className="gradient-text">in motion.</span></>}
        description="Add new titles, keep book details accurate, and manage every copy from one place."
        aside={
          <div className="hidden rounded-xl border border-white/[0.08] bg-slate-950/45 px-4 py-3 sm:block">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Catalog</p>
            <p className="mt-1 text-lg font-semibold text-slate-100">{loading ? '—' : books.length} titles</p>
          </div>
        }
        actions={<Button icon={<FiPlus />} onClick={openAddModal}>Add book</Button>}
      />

      <Card padding="none">
        {loading ? (
          <div className="py-12 flex justify-center"><Spinner /></div>
        ) : (
          <DataTable columns={columns} data={books} />
        )}
      </Card>

      {/* ── Add Book Modal ── */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Book" size="lg">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          {renderBookFormFields(false)}
          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="ghost" onClick={() => setIsAddModalOpen(false)} type="button">Cancel</Button>
            <Button type="submit">Create Book</Button>
          </div>
        </form>
      </Modal>

      {/* ── Edit Book Modal ── */}
      <Modal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setEditingBookId(null); }} title="Edit Book" size="lg">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          {renderBookFormFields(true)}
          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="ghost" onClick={() => { setIsEditModalOpen(false); setEditingBookId(null); }} type="button">Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Modal>

      {/* ── Add Copy Modal ── */}
      <Modal isOpen={isCopyModalOpen} onClose={() => setIsCopyModalOpen(false)} title="Add Book Copy">
        <form onSubmit={handleCopySubmit} className="space-y-4">
          <Input label="Barcode" value={copyBarcode} onChange={(e) => setCopyBarcode(e.target.value)} required />
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Condition</label>
            <select
              value={copyCondition}
              onChange={(e) => setCopyCondition(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
            >
              <option value="New" className="bg-black text-white">New</option>
              <option value="Good" className="bg-black text-white">Good</option>
              <option value="Fair" className="bg-black text-white">Fair</option>
              <option value="Poor" className="bg-black text-white">Poor</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="ghost" onClick={() => setIsCopyModalOpen(false)} type="button">Cancel</Button>
            <Button type="submit">Add Copy</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminBooksPage;
