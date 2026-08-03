import { useState, useEffect } from 'react';
import { booksApi } from '@/api/books';
import { BookListItem, Category } from '@/types';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import SearchBar from '@/components/ui/SearchBar';
import EmptyState from '@/components/ui/EmptyState';
import PageHeader from '@/components/ui/PageHeader';
import BookCover from '@/components/ui/BookCover';
import { FiArrowUpRight, FiBook } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const CatalogPage = () => {
  const [books, setBooks] = useState<BookListItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await booksApi.getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const params: any = {};
        if (searchTerm) params.search = searchTerm;
        if (selectedCategory) params.category_id = selectedCategory;
        
        const data = await booksApi.getBooks(params);
        setBooks(data);
      } catch (error) {
        console.error("Failed to load books", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [searchTerm, selectedCategory]);

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Discover your next read"
        title={<>A library made for <span className="gradient-text">curious minds.</span></>}
        description="Browse titles, explore new subjects, and find a book worth bringing home."
        aside={
          <div className="hidden rounded-xl border border-white/[0.08] bg-slate-950/45 px-4 py-3 sm:block">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Collection</p>
            <p className="mt-1 text-lg font-semibold text-slate-100">{loading ? '—' : books.length} titles</p>
          </div>
        }
        actions={
          <div className="w-full sm:w-80">
            <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search title, author, or ISBN..." />
          </div>
        }
      />

      {/* Category Pills */}
      <section>
        <div className="mb-3 flex items-center justify-between gap-4 px-1">
          <p className="text-sm font-medium text-slate-300">Browse by subject</p>
          {selectedCategory && <button onClick={() => setSelectedCategory('')} className="text-xs font-medium text-indigo-300 transition-colors hover:text-indigo-200">Clear filter</button>}
        </div>
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory('')}
            aria-pressed={selectedCategory === ''}
            className={`category-pill whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
              selectedCategory === ''
                ? 'category-pill--active border border-indigo-300/20 bg-gradient-to-r from-indigo-500 to-violet-500 text-white'
                : 'border border-white/[0.08] bg-slate-950/55 text-slate-300 hover:border-white/[0.14] hover:bg-white/[0.06]'
            }`}
          >
            All categories
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              aria-pressed={selectedCategory === cat.id}
              className={`category-pill whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'category-pill--active border border-indigo-300/20 bg-gradient-to-r from-indigo-500 to-violet-500 text-white'
                  : 'border border-white/[0.08] bg-slate-950/55 text-slate-300 hover:border-white/[0.14] hover:bg-white/[0.06]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* Books Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="overflow-hidden rounded-2xl border border-white/[0.07] bg-slate-950/45">
              <div className="h-60 animate-pulse bg-gradient-to-br from-slate-800/75 to-slate-900/70" />
              <div className="space-y-3 p-5">
                <div className="h-2.5 w-20 animate-pulse rounded-full bg-slate-800" />
                <div className="h-5 w-4/5 animate-pulse rounded bg-slate-800" />
                <div className="h-3 w-3/5 animate-pulse rounded bg-slate-800/80" />
              </div>
            </div>
          ))}
        </div>
      ) : books.length === 0 ? (
        <EmptyState 
          icon={<FiBook />}
          title="No books found"
          description="Try adjusting your search or category filters to find what you're looking for."
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {books.map((book, idx) => (
            <Link key={book.id} to={`/books/${book.id}`} className="group block h-full">
              <Card hoverable padding="none" className="catalog-card flex h-full flex-col overflow-hidden animate-fade-in" style={{ animationDelay: `${idx * 45}ms` }}>
                <div className="relative h-60 overflow-hidden border-b border-white/[0.06]">
                  <BookCover
                    title={book.title}
                    author={book.authors?.map(a => a.name).join(', ')}
                    coverUrl={book.cover_image_url}
                    className="catalog-card__cover h-full w-full"
                  />
                  {book.available_copies > 0 ? (
                    <Badge variant="success" className="absolute right-3 top-3 shadow-lg shadow-emerald-950/30">Available</Badge>
                  ) : (
                    <Badge variant="warning" className="absolute right-3 top-3 shadow-lg shadow-amber-950/30">Unavailable</Badge>
                  )}
                </div>
                
                <div className="flex flex-grow flex-col p-5">
                  {book.category && (
                    <p className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-indigo-300">
                      {book.category.name}
                    </p>
                  )}
                  <h3 className="mb-1 line-clamp-2 text-lg font-bold tracking-[-0.02em] text-slate-100 transition-colors group-hover:text-indigo-200">
                    {book.title}
                  </h3>
                  <p className="mb-4 line-clamp-1 text-sm text-slate-400">
                    {book.authors?.map(a => a.name).join(', ')}
                  </p>
                  
                  <div className="mt-auto flex items-center justify-between border-t border-white/[0.06] pt-4">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                      <span className={`h-1.5 w-1.5 rounded-full ${book.available_copies > 0 ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                      {book.available_copies} {book.available_copies === 1 ? 'copy' : 'copies'}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-semibold text-indigo-300 transition-transform group-hover:translate-x-0.5">View <FiArrowUpRight size={14} /></span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CatalogPage;
