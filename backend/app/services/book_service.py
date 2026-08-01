from __future__ import annotations
from typing import List, Optional
from sqlalchemy.orm import Session
from app.schemas.book import BookCreate, BookUpdate, BookCopyCreate, AuthorCreate, CategoryCreate, BookListResponse
from app.models.book import Book, Author, Category, BookCopy
from app.repositories import book_repo
from app.core.errors import NotFoundError, ConflictError
import uuid

def get_books(db: Session, search: Optional[str] = None, category_id: Optional[str] = None, skip: int = 0, limit: int = 100) -> List[dict]:
    books = book_repo.get_all(db, search, category_id, skip, limit)
    result = []
    for b in books:
        available_copies = sum(1 for c in b.copies if c.is_available)
        
        book_dict = {
            "id": b.id,
            "isbn": b.isbn,
            "title": b.title,
            "description": b.description,
            "published_year": b.published_year,
            "cover_image_url": b.cover_image_url,
            "category": b.category,
            "authors": b.authors,
            "available_copies": available_copies,
            "created_at": b.created_at
        }
        result.append(book_dict)
    return result

def get_book(db: Session, book_id: str) -> Book:
    book = book_repo.get_by_id(db, book_id)
    if not book:
        raise NotFoundError("Book not found")
    return book

def create_book(db: Session, data: BookCreate) -> Book:
    authors = []
    if data.author_ids:
        authors = book_repo.get_authors_by_ids(db, [str(aid) for aid in data.author_ids])
    return book_repo.create(db, data, authors)

def update_book(db: Session, book_id: str, data: BookUpdate) -> Book:
    book = get_book(db, book_id)
    authors = None
    if data.author_ids is not None:
        authors = book_repo.get_authors_by_ids(db, [str(aid) for aid in data.author_ids])
    return book_repo.update(db, book, data, authors)

def delete_book(db: Session, book_id: str) -> None:
    book = get_book(db, book_id)
    book_repo.delete(db, book)

def create_author(db: Session, data: AuthorCreate) -> Author:
    return book_repo.create_author(db, data)

def get_authors(db: Session, skip: int = 0, limit: int = 100) -> List[Author]:
    return book_repo.get_all_authors(db, skip, limit)

def create_category(db: Session, data: CategoryCreate) -> Category:
    return book_repo.create_category(db, data)

def get_categories(db: Session, skip: int = 0, limit: int = 100) -> List[Category]:
    return book_repo.get_all_categories(db, skip, limit)

def create_copy(db: Session, data: BookCopyCreate) -> BookCopy:
    book = get_book(db, str(data.book_id))
    return book_repo.create_copy(db, data)
