from __future__ import annotations
from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
from uuid import UUID
from app.schemas.book import BookCopyResponse

class LoanCreate(BaseModel):
    copy_id: UUID

class LoanResponse(BaseModel):
    id: UUID
    user_id: UUID
    copy_id: UUID
    borrowed_at: datetime
    due_date: datetime
    returned_at: Optional[datetime] = None
    status: str
    book_copy: Optional[BookCopyResponse] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class ReservationCreate(BaseModel):
    book_id: UUID

class ReservationResponse(BaseModel):
    id: UUID
    user_id: UUID
    book_id: UUID
    reserved_at: datetime
    expires_at: datetime
    status: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class FineResponse(BaseModel):
    id: UUID
    loan_id: UUID
    user_id: UUID
    amount: float
    reason: str
    is_paid: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class DashboardStats(BaseModel):
    total_books: int
    total_users: int
    active_loans: int
    overdue_loans: int
    total_fines_collected: float
