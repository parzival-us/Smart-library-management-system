from __future__ import annotations
import enum
from sqlalchemy import Column, String, DateTime, Float, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.db.base import Base, BaseMixin
from datetime import datetime

class LoanStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    RETURNED = "RETURNED"
    OVERDUE = "OVERDUE"

class ReservationStatus(str, enum.Enum):
    PENDING = "PENDING"
    FULFILLED = "FULFILLED"
    CANCELLED = "CANCELLED"
    EXPIRED = "EXPIRED"

class Loan(Base, BaseMixin):
    __tablename__ = "loans"
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    copy_id = Column(String(36), ForeignKey("book_copies.id"), nullable=False)
    borrowed_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    due_date = Column(DateTime, nullable=False)
    returned_at = Column(DateTime, nullable=True)
    status = Column(String, default=LoanStatus.ACTIVE.value, nullable=False)

    user = relationship("User", back_populates="loans")
    book_copy = relationship("BookCopy", back_populates="loans")
    fines = relationship("Fine", back_populates="loan")

class Reservation(Base, BaseMixin):
    __tablename__ = "reservations"
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    book_id = Column(String(36), ForeignKey("books.id"), nullable=False)
    reserved_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    status = Column(String, default=ReservationStatus.PENDING.value, nullable=False)

    user = relationship("User", back_populates="reservations")
    book = relationship("Book")

class Fine(Base, BaseMixin):
    __tablename__ = "fines"
    loan_id = Column(String(36), ForeignKey("loans.id"), nullable=False)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    amount = Column(Float, nullable=False)
    reason = Column(String, nullable=False)
    is_paid = Column(Boolean, default=False)

    loan = relationship("Loan", back_populates="fines")
    user = relationship("User", back_populates="fines")
