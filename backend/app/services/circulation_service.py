from __future__ import annotations
from typing import List
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.circulation import Loan, Reservation, Fine, LoanStatus, ReservationStatus
from app.repositories import circulation_repo, book_repo, user_repo
from app.core.errors import NotFoundError, ConflictError, BadRequestError
from app.schemas.circulation import DashboardStats

def borrow_book(db: Session, user_id: str, copy_id: str) -> Loan:
    copy = book_repo.get_copy_by_id(db, copy_id)
    if not copy:
        raise NotFoundError("Book copy not found")
    if not copy.is_available:
        raise ConflictError("Book copy is not available")
    
    loan = Loan(
        user_id=user_id,
        copy_id=copy_id,
        borrowed_at=datetime.utcnow(),
        due_date=datetime.utcnow() + timedelta(days=14),
        status=LoanStatus.ACTIVE.value
    )
    book_repo.update_availability(db, copy, False)
    return circulation_repo.create_loan(db, loan)

def return_book(db: Session, user_id: str, loan_id: str, staff_override: bool = False) -> Loan:
    loan = circulation_repo.get_loan_by_id(db, loan_id)
    if not loan:
        raise NotFoundError("Loan not found")
    if loan.user_id != user_id and not staff_override:
        raise ConflictError("You do not have permission to return this loan")
    if loan.status != LoanStatus.ACTIVE.value:
        raise ConflictError("Loan is already returned or resolved")
        
    loan.returned_at = datetime.utcnow()
    loan.status = LoanStatus.RETURNED.value
    
    if loan.returned_at > loan.due_date:
        days_late = (loan.returned_at - loan.due_date).days
        if days_late > 0:
            fine_amount = days_late * 0.50
            fine = Fine(
                loan_id=loan.id,
                user_id=loan.user_id,
                amount=fine_amount,
                reason=f"Overdue by {days_late} days",
                is_paid=False
            )
            circulation_repo.create_fine(db, fine)
            
    book_repo.update_availability(db, loan.book_copy, True)
    return circulation_repo.update_loan(db, loan)

def get_user_loans(db: Session, user_id: str) -> List[Loan]:
    return circulation_repo.get_loans_by_user(db, user_id)

def get_all_loans(db: Session, skip: int = 0, limit: int = 100) -> List[Loan]:
    return circulation_repo.get_all_loans(db, skip, limit)

def create_reservation(db: Session, user_id: str, book_id: str) -> Reservation:
    book = book_repo.get_by_id(db, book_id)
    if not book:
        raise NotFoundError("Book not found")
        
    reservation = Reservation(
        user_id=user_id,
        book_id=book_id,
        reserved_at=datetime.utcnow(),
        expires_at=datetime.utcnow() + timedelta(hours=48),
        status=ReservationStatus.PENDING.value
    )
    return circulation_repo.create_reservation(db, reservation)

def get_user_reservations(db: Session, user_id: str) -> List[Reservation]:
    return circulation_repo.get_reservations_by_user(db, user_id)

def get_user_fines(db: Session, user_id: str) -> List[Fine]:
    return circulation_repo.get_fines_by_user(db, user_id)

def pay_fine(db: Session, user_id: str, fine_id: str) -> Fine:
    fine = circulation_repo.get_fine_by_id(db, fine_id)
    if not fine:
        raise NotFoundError("Fine not found")
    if fine.user_id != user_id:
        raise ConflictError("This fine belongs to another user")
    if fine.is_paid:
        raise ConflictError("Fine is already paid")
        
    fine.is_paid = True
    return circulation_repo.update_fine(db, fine)

def get_dashboard_stats(db: Session) -> DashboardStats:
    total_books = book_repo.count(db)
    total_users = user_repo.count(db)
    active_loans = circulation_repo.count_active_loans(db)
    overdue_loans = circulation_repo.count_overdue_loans(db)
    total_fines = circulation_repo.sum_paid_fines(db)
    
    return DashboardStats(
        total_books=total_books,
        total_users=total_users,
        active_loans=active_loans,
        overdue_loans=overdue_loans,
        total_fines_collected=total_fines
    )
