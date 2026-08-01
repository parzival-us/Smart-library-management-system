from __future__ import annotations
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.circulation import Loan, Reservation, Fine, LoanStatus

# Loans
def get_loan_by_id(db: Session, loan_id: str) -> Optional[Loan]:
    return db.query(Loan).filter(Loan.id == loan_id).first()

def get_loans_by_user(db: Session, user_id: str) -> List[Loan]:
    return db.query(Loan).filter(Loan.user_id == user_id).all()

def get_all_loans(db: Session, skip: int = 0, limit: int = 100) -> List[Loan]:
    return db.query(Loan).offset(skip).limit(limit).all()

def get_active_by_copy(db: Session, copy_id: str) -> Optional[Loan]:
    return db.query(Loan).filter(
        Loan.copy_id == copy_id,
        Loan.status == LoanStatus.ACTIVE.value
    ).first()

def create_loan(db: Session, loan: Loan) -> Loan:
    db.add(loan)
    db.commit()
    db.refresh(loan)
    return loan

def update_loan(db: Session, loan: Loan) -> Loan:
    db.add(loan)
    db.commit()
    db.refresh(loan)
    return loan

def count_active_loans(db: Session) -> int:
    return db.query(Loan).filter(Loan.status == LoanStatus.ACTIVE.value).count()

def count_overdue_loans(db: Session) -> int:
    return db.query(Loan).filter(Loan.status == LoanStatus.OVERDUE.value).count()

# Reservations
def get_reservation_by_id(db: Session, reservation_id: str) -> Optional[Reservation]:
    return db.query(Reservation).filter(Reservation.id == reservation_id).first()

def get_reservations_by_user(db: Session, user_id: str) -> List[Reservation]:
    return db.query(Reservation).filter(Reservation.user_id == user_id).all()

def create_reservation(db: Session, reservation: Reservation) -> Reservation:
    db.add(reservation)
    db.commit()
    db.refresh(reservation)
    return reservation

def update_reservation(db: Session, reservation: Reservation) -> Reservation:
    db.add(reservation)
    db.commit()
    db.refresh(reservation)
    return reservation

# Fines
def get_fine_by_id(db: Session, fine_id: str) -> Optional[Fine]:
    return db.query(Fine).filter(Fine.id == fine_id).first()

def get_fines_by_user(db: Session, user_id: str) -> List[Fine]:
    return db.query(Fine).filter(Fine.user_id == user_id).all()

def create_fine(db: Session, fine: Fine) -> Fine:
    db.add(fine)
    db.commit()
    db.refresh(fine)
    return fine

def update_fine(db: Session, fine: Fine) -> Fine:
    db.add(fine)
    db.commit()
    db.refresh(fine)
    return fine

def sum_paid_fines(db: Session) -> float:
    result = db.query(func.sum(Fine.amount)).filter(Fine.is_paid == True).scalar()
    return result if result else 0.0
