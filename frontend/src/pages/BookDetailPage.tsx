import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { booksApi } from '@/api/books';
import { circulationApi } from '@/api/circulation';
import { Book } from '@/types';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import BookCover from '@/components/ui/BookCover';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiBookmark } from 'react-icons/fi';

const BookDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, isStaff } = useAuth();
  
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        if (id) {
          const data = await booksApi.getBook(id);
          setBook(data);
        }
      } catch (error) {
        toast.error("Failed to load book details");
        navigate('/catalog');
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id, navigate]);

  const handleBorrow = async (copyId: string) => {
    if (!isAuthenticated) {
      toast.error('Please login to borrow a book');
      navigate('/login');
      return;
    }
    setActionLoading(copyId);
    try {
      await circulationApi.borrowBook(copyId);
      toast.success('Successfully borrowed book');
      // Refresh book data
      if (id) {
        const data = await booksApi.getBook(id);
        setBook(data);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to borrow book');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReserve = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to reserve a book');
      navigate('/login');
      return;
    }
    if (!id) return;
    
    setActionLoading('reserve');
    try {
      await circulationApi.createReservation(id);
      toast.success('Successfully reserved book');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to reserve book');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Spinner size="lg" /></div>;
  if (!book) return null;

  const availableCopies = book.copies?.filter(c => c.is_available) || [];
  const unavailableCopies = book.copies?.filter(c => !c.is_available) || [];

  return (
    <div className="animate-fade-in pb-12">
      <button 
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center rounded-lg px-1 py-1 text-sm font-medium text-slate-400 transition-colors hover:text-white"
      >
        <FiArrowLeft className="mr-2" /> Back to Catalog
      </button>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Left Col: Image */}
        <div className="md:col-span-1">
          <Card padding="none" className="aspect-[2/3] overflow-hidden shadow-2xl shadow-black/50">
            <BookCover
              title={book.title}
              author={book.authors?.map(author => author.name).join(', ')}
              coverUrl={book.cover_image_url}
              className="h-full w-full"
            />
          </Card>
        </div>

        {/* Right Col: Details */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <div className="flex items-center space-x-3 mb-3">
              {book.category && <Badge variant="primary">{book.category.name}</Badge>}
              <span className="text-sm text-slate-400">ISBN: {book.isbn}</span>
            </div>
            <h1 className="mb-2 text-4xl font-bold tracking-[-0.04em] text-white sm:text-5xl">{book.title}</h1>
            <p className="text-lg font-medium text-indigo-300">
              By {book.authors?.map(a => a.name).join(', ')}
            </p>
          </div>

          <div className="prose prose-invert max-w-none">
            <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
            <p className="text-slate-300 leading-relaxed">
              {book.description || 'No description available for this book.'}
            </p>
          </div>

          <div className="flex items-center space-x-4 pt-4">
            <div className="glass flex-1 rounded-xl border-l-4 border-l-indigo-400 p-4">
              <p className="text-sm text-slate-400 mb-1">Published</p>
              <p className="text-lg font-semibold text-white">{book.published_year || 'Unknown'}</p>
            </div>
            <div className="glass flex-1 rounded-xl border-l-4 border-l-emerald-400 p-4">
              <p className="text-sm text-slate-400 mb-1">Available Copies</p>
              <p className="text-lg font-semibold text-white">{availableCopies.length} / {book.copies?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Copies Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-white mb-6">Library Copies</h2>
        
        {(!book.copies || book.copies.length === 0) ? (
          <Card className="text-center py-8">
            <p className="text-slate-400">No physical copies recorded for this book.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableCopies.map(copy => (
              <Card key={copy.id} className="flex justify-between items-center" padding="sm">
                <div>
                  <p className="font-medium text-slate-200">Barcode: {copy.barcode}</p>
                  <p className="text-sm text-slate-400">Condition: {copy.condition}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="success">Available</Badge>
                  {!isStaff && (
                    <Button 
                      size="sm" 
                      onClick={() => handleBorrow(copy.id)}
                      loading={actionLoading === copy.id}
                    >
                      Borrow
                    </Button>
                  )}
                </div>
              </Card>
            ))}
            
            {unavailableCopies.map(copy => (
              <Card key={copy.id} className="flex justify-between items-center bg-black" padding="sm">
                <div>
                  <p className="font-medium text-slate-400">Barcode: {copy.barcode}</p>
                  <p className="text-sm text-slate-500">Condition: {copy.condition}</p>
                </div>
                <Badge variant="warning">Borrowed</Badge>
              </Card>
            ))}
          </div>
        )}

        {/* Reservation Action */}
        {!isStaff && availableCopies.length === 0 && book.copies && book.copies.length > 0 && (
          <Card className="mt-6 flex flex-col sm:flex-row items-center justify-between bg-indigo-900/20 border-indigo-500/20">
            <div className="mb-4 sm:mb-0">
              <h4 className="font-semibold text-white mb-1">No copies available right now</h4>
              <p className="text-sm text-slate-300">Reserve this book to be next in line when a copy is returned.</p>
            </div>
            <Button 
              icon={<FiBookmark />} 
              onClick={handleReserve}
              loading={actionLoading === 'reserve'}
            >
              Reserve Book
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BookDetailPage;
