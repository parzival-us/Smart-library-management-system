from __future__ import annotations
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.engine import get_db
from app.schemas.book import (
    BookCreate, BookUpdate, BookResponse, BookListResponse,
    CategoryCreate, CategoryResponse, AuthorCreate, AuthorResponse,
    BookCopyCreate, BookCopyResponse
)
from app.services import book_service
from app.core.deps import get_staff_user, get_admin_user

router = APIRouter()

@router.get("/", response_model=List[BookListResponse])
def list_books(
    search: Optional[str] = None,
    category_id: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1),
    db: Session = Depends(get_db)
):
    return book_service.get_books(db, search, category_id, skip, limit)

@router.get("/categories/", response_model=List[CategoryResponse])
def list_categories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return book_service.get_categories(db, skip, limit)

@router.post("/categories/", response_model=CategoryResponse)
def create_category(data: CategoryCreate, db: Session = Depends(get_db), current_user = Depends(get_staff_user)):
    return book_service.create_category(db, data)

@router.get("/authors/", response_model=List[AuthorResponse])
def list_authors(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return book_service.get_authors(db, skip, limit)

@router.post("/authors/", response_model=AuthorResponse)
def create_author(data: AuthorCreate, db: Session = Depends(get_db), current_user = Depends(get_staff_user)):
    return book_service.create_author(db, data)

@router.get("/{book_id}", response_model=BookResponse)
def get_book(book_id: str, db: Session = Depends(get_db)):
    return book_service.get_book(db, book_id)

@router.post("/", response_model=BookResponse)
def create_book(data: BookCreate, db: Session = Depends(get_db), current_user = Depends(get_staff_user)):
    return book_service.create_book(db, data)

@router.put("/{book_id}", response_model=BookResponse)
def update_book(book_id: str, data: BookUpdate, db: Session = Depends(get_db), current_user = Depends(get_staff_user)):
    return book_service.update_book(db, book_id, data)

@router.delete("/{book_id}", status_code=204)
def delete_book(book_id: str, db: Session = Depends(get_db), current_user = Depends(get_admin_user)):
    book_service.delete_book(db, book_id)

@router.post("/copies/", response_model=BookCopyResponse)
def create_copy(data: BookCopyCreate, db: Session = Depends(get_db), current_user = Depends(get_staff_user)):
    return book_service.create_copy(db, data)
