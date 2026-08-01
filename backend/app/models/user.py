from __future__ import annotations
import enum
from sqlalchemy import Column, String, Boolean
from sqlalchemy.orm import relationship
from app.db.base import Base, BaseMixin

class UserRole(str, enum.Enum):
    ADMIN = "ADMIN"
    LIBRARIAN = "LIBRARIAN"
    STUDENT = "STUDENT"

class User(Base, BaseMixin):
    __tablename__ = "users"

    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, default=UserRole.STUDENT.value, nullable=False)
    is_active = Column(Boolean, default=True)

    loans = relationship("Loan", back_populates="user")
    reservations = relationship("Reservation", back_populates="user")
    fines = relationship("Fine", back_populates="user")
