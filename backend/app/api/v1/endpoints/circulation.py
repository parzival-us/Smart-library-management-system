from __future__ import annotations
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List
from app.db.engine import get_db
from app.schemas.circulation import LoanCreate, LoanResponse, ReservationCreate, ReservationResponse, FineResponse
from app.services import circulation_service
from app.core.deps import get_current_user, get_staff_user
from app.models.user import User, UserRole

router = APIRouter()

@router.post("/loans", response_model=LoanResponse)
def borrow_book(data: LoanCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return circulation_service.borrow_book(db, str(current_user.id), str(data.copy_id))

@router.put("/loans/{loan_id}/return", response_model=LoanResponse)
def return_book(loan_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    staff_override = current_user.role in [UserRole.ADMIN.value, UserRole.LIBRARIAN.value]
    return circulation_service.return_book(db, str(current_user.id), loan_id, staff_override)

@router.get("/loans/my", response_model=List[LoanResponse])
def my_loans(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return circulation_service.get_user_loans(db, str(current_user.id))

@router.get("/loans", response_model=List[LoanResponse])
def all_loans(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_staff_user)):
    return circulation_service.get_all_loans(db, skip, limit)

@router.post("/reservations", response_model=ReservationResponse)
def create_reservation(data: ReservationCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return circulation_service.create_reservation(db, str(current_user.id), str(data.book_id))

@router.get("/reservations/my", response_model=List[ReservationResponse])
def my_reservations(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return circulation_service.get_user_reservations(db, str(current_user.id))

@router.get("/fines/my", response_model=List[FineResponse])
def my_fines(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return circulation_service.get_user_fines(db, str(current_user.id))

@router.put("/fines/{fine_id}/pay", response_model=FineResponse)
def pay_fine(fine_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return circulation_service.pay_fine(db, str(current_user.id), fine_id)
