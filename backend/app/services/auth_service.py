from __future__ import annotations
from sqlalchemy.orm import Session
from app.schemas.user import UserCreate, Token
from app.repositories import user_repo
from app.core.security import get_password_hash, verify_password, create_access_token
from app.core.errors import ConflictError, BadRequestError

def register(db: Session, user_data: UserCreate) -> Token:
    existing = user_repo.get_by_email(db, user_data.email)
    if existing:
        raise ConflictError("Email already registered")
    
    hashed = get_password_hash(user_data.password)
    user = user_repo.create(db, user_data, hashed)
    
    token = create_access_token(data={"sub": str(user.id), "role": user.role})
    return Token(access_token=token, token_type="bearer")

def login(db: Session, email: str, password: str) -> Token:
    user = user_repo.get_by_email(db, email)
    if not user or not verify_password(password, user.hashed_password):
        raise BadRequestError("Invalid credentials")
    
    token = create_access_token(data={"sub": str(user.id), "role": user.role})
    return Token(access_token=token, token_type="bearer")
