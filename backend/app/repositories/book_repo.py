from __future__ import annotations
import uuid
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.book import Book, Author, Category, BookCopy
from app.schemas.book import BookCreate, BookUpdate, BookCopyCreate, AuthorCreate, CategoryCreate

def get_by_id(db: Session, book_id: str) -> Optional[Book]:
    return db.query(Book).filter(Book.id == book_id).first()

def get_all(db: Session, search: Optional[str] = None, category_id: Optional[str] = None, skip: int = 0, limit: int = 100) -> List[Book]:
    query = db.query(Book)
    if search:
        query = query.filter(or_(Book.title.ilike(f"%{search}%"), Book.isbn.ilike(f"%{search}%")))
    if category_id:
        query = query.filter(Book.category_id == category_id)
    return query.offset(skip).limit(limit).all()

def count(db: Session) -> int:
    return db.query(Book).count()

def create(db: Session, data: BookCreate, authors: List[Author]) -> Book:
    book = Book(
        isbn=data.isbn,
        title=data.title,
        description=data.description,
        published_year=data.published_year,
        cover_image_url=data.cover_image_url,
        category_id=str(data.category_id) if data.category_id else None
    )
    if authors:
        book.authors = authors
    db.add(book)
    db.commit()
    db.refresh(book)
    return book

def update(db: Session, book: Book, data: BookUpdate, authors: Optional[List[Author]] = None) -> Book:
    update_data = data.model_dump(exclude_unset=True)
    if 'author_ids' in update_data:
        del update_data['author_ids']
    
    for key, value in update_data.items():
        if isinstance(value, uuid.UUID):
            value = str(value)
        setattr(book, key, value)
    
    if authors is not None:
        book.authors = authors
        
    db.add(book)
    db.commit()
    db.refresh(book)
    return book

def delete(db: Session, book: Book) -> None:
    db.delete(book)
    db.commit()

# Authors
def get_author_by_id(db: Session, author_id: str) -> Optional[Author]:
    return db.query(Author).filter(Author.id == author_id).first()

def get_authors_by_ids(db: Session, author_ids: List[str]) -> List[Author]:
    return db.query(Author).filter(Author.id.in_(author_ids)).all()

def get_all_authors(db: Session, skip: int = 0, limit: int = 100) -> List[Author]:
    return db.query(Author).offset(skip).limit(limit).all()

def create_author(db: Session, data: AuthorCreate) -> Author:
    author = Author(name=data.name, bio=data.bio)
    db.add(author)
    db.commit()
    db.refresh(author)
    return author

# Categories
def get_category_by_id(db: Session, category_id: str) -> Optional[Category]:
    return db.query(Category).filter(Category.id == category_id).first()

def get_all_categories(db: Session, skip: int = 0, limit: int = 100) -> List[Category]:
    return db.query(Category).offset(skip).limit(limit).all()

def create_category(db: Session, data: CategoryCreate) -> Category:
    category = Category(name=data.name, description=data.description)
    db.add(category)
    db.commit()
    db.refresh(category)
    return category

# Book Copies
def get_copy_by_id(db: Session, copy_id: str) -> Optional[BookCopy]:
    return db.query(BookCopy).filter(BookCopy.id == copy_id).first()

def get_copies_by_book_id(db: Session, book_id: str) -> List[BookCopy]:
    return db.query(BookCopy).filter(BookCopy.book_id == book_id).all()

def create_copy(db: Session, data: BookCopyCreate) -> BookCopy:
    copy = BookCopy(
        book_id=str(data.book_id),
        barcode=data.barcode,
        condition=data.condition
    )
    db.add(copy)
    db.commit()
    db.refresh(copy)
    return copy

def update_availability(db: Session, copy: BookCopy, is_available: bool) -> BookCopy:
    copy.is_available = is_available
    db.add(copy)
    db.commit()
    db.refresh(copy)
    return copy
