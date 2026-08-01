from __future__ import annotations
from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime
from uuid import UUID

class AuthorBase(BaseModel):
    name: str
    bio: Optional[str] = None

class AuthorCreate(AuthorBase):
    pass

class AuthorResponse(AuthorBase):
    id: UUID
    model_config = ConfigDict(from_attributes=True)

class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: UUID
    model_config = ConfigDict(from_attributes=True)

class BookCopyBase(BaseModel):
    barcode: str
    condition: str = "Good"

class BookCopyCreate(BookCopyBase):
    book_id: UUID

class BookCopyResponse(BookCopyBase):
    id: UUID
    book_id: UUID
    is_available: bool
    model_config = ConfigDict(from_attributes=True)

class BookBase(BaseModel):
    isbn: str
    title: str
    description: Optional[str] = None
    published_year: Optional[int] = None
    cover_image_url: Optional[str] = None
    category_id: Optional[UUID] = None

class BookCreate(BookBase):
    author_ids: Optional[List[UUID]] = None

class BookUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    published_year: Optional[int] = None
    cover_image_url: Optional[str] = None
    category_id: Optional[UUID] = None
    author_ids: Optional[List[UUID]] = None

class BookResponse(BookBase):
    id: UUID
    created_at: datetime
    category: Optional[CategoryResponse] = None
    authors: List[AuthorResponse] = []
    copies: List[BookCopyResponse] = []
    model_config = ConfigDict(from_attributes=True)

class BookListResponse(BookBase):
    id: UUID
    created_at: datetime
    category: Optional[CategoryResponse] = None
    authors: List[AuthorResponse] = []
    available_copies: int = 0
    model_config = ConfigDict(from_attributes=True)
