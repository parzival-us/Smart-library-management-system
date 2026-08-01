from __future__ import annotations
from sqlalchemy import Column, String, Integer, ForeignKey, Table, Boolean
from sqlalchemy.orm import relationship
from app.db.base import Base, BaseMixin

book_authors = Table(
    "book_authors",
    Base.metadata,
    Column("book_id", String(36), ForeignKey("books.id"), primary_key=True),
    Column("author_id", String(36), ForeignKey("authors.id"), primary_key=True)
)

class Author(Base, BaseMixin):
    __tablename__ = "authors"
    name = Column(String, nullable=False)
    bio = Column(String, nullable=True)

class Category(Base, BaseMixin):
    __tablename__ = "categories"
    name = Column(String, unique=True, nullable=False)
    description = Column(String, nullable=True)

class Book(Base, BaseMixin):
    __tablename__ = "books"
    isbn = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    published_year = Column(Integer, nullable=True)
    cover_image_url = Column(String, nullable=True)
    category_id = Column(String(36), ForeignKey("categories.id"), nullable=True)

    category = relationship("Category")
    authors = relationship("Author", secondary=book_authors)
    copies = relationship("BookCopy", back_populates="book", cascade="all, delete-orphan")

class BookCopy(Base, BaseMixin):
    __tablename__ = "book_copies"
    book_id = Column(String(36), ForeignKey("books.id"), nullable=False)
    barcode = Column(String, unique=True, nullable=False)
    condition = Column(String, default="Good")
    is_available = Column(Boolean, default=True)

    book = relationship("Book", back_populates="copies")
    loans = relationship("Loan", back_populates="book_copy")
