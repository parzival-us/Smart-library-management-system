import React, { useState, useEffect } from 'react';
import { booksApi } from '@/api/books';
import { BookListItem, Category } from '@/types';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import SearchBar from '@/components/ui/SearchBar';
import Spinner from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';
import { FiBook, FiFilter } from 'react-icons/fi';
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Library Catalog</h1>
          <p className="text-slate-400">Discover our collection of books and resources.</p>
        </div>
        <div className="w-full md:w-96">
          <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search books by title, author, ISBN..." />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-4 scrollbar-hide">
        <button
          onClick={() => setSelectedCategory('')}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
            selectedCategory === '' 
              ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' 
              : 'glass text-slate-300 hover:bg-white/10'
          }`}
        >
          All Categories
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat.id 
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' 
                : 'glass text-slate-300 hover:bg-white/10'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Books Grid */}
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : books.length === 0 ? (
        <EmptyState 
          icon={<FiBook />}
          title="No books found"
          description="Try adjusting your search or category filters to find what you're looking for."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map((book, idx) => (
            <Link key={book.id} to={`/books/${book.id}`} className="block h-full group">
              <Card hoverable padding="none" className={`h-full flex flex-col overflow-hidden animate-fade-in`} style={{ animationDelay: `${idx * 50}ms` }}>
                {/* Cover Placeholder */}
                <div className="h-48 bg-gradient-to-br from-indigo-900 to-slate-900 flex items-center justify-center border-b border-white/5 relative overflow-hidden">
                  <span className="text-6xl font-bold text-white/10 group-hover:scale-110 transition-transform duration-500">
                    {book.title.charAt(0)}
                  </span>
                  {book.available_copies > 0 ? (
                    <Badge variant="success" className="absolute top-3 right-3 shadow-lg">Available</Badge>
                  ) : (
                    <Badge variant="warning" className="absolute top-3 right-3 shadow-lg">Unavailable</Badge>
                  )}
                </div>
                
                <div className="p-5 flex flex-col flex-grow">
                  {book.category && (
                    <p className="text-xs font-semibold text-indigo-400 mb-2 tracking-wider uppercase">
                      {book.category.name}
                    </p>
                  )}
                  <h3 className="text-lg font-bold text-slate-100 mb-1 line-clamp-2 group-hover:text-indigo-300 transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-sm text-slate-400 mb-4 line-clamp-1">
                    {book.authors?.map(a => a.name).join(', ')}
                  </p>
                  
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="text-xs text-slate-500 font-medium">
                      {book.available_copies} copies available
                    </span>
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
