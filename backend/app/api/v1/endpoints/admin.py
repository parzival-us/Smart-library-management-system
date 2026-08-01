from __future__ import annotations
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.db.engine import get_db
from app.schemas.circulation import DashboardStats
from app.schemas.user import UserResponse, UserUpdate
from app.services import circulation_service
from app.repositories import user_repo
from app.core.deps import get_admin_user, get_staff_user
from app.core.errors import NotFoundError

router = APIRouter()

@router.get("/stats", response_model=DashboardStats)
def get_stats(db: Session = Depends(get_db), current_user = Depends(get_staff_user)):
    return circulation_service.get_dashboard_stats(db)

@router.get("/users", response_model=List[UserResponse])
def list_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user = Depends(get_admin_user)):
    return user_repo.get_all(db, skip, limit)

@router.put("/users/{user_id}", response_model=UserResponse)
def update_user(user_id: str, data: UserUpdate, db: Session = Depends(get_db), current_user = Depends(get_admin_user)):
    user = user_repo.get_by_id(db, user_id)
    if not user:
        raise NotFoundError("User not found")
    return user_repo.update(db, user, data.model_dump(exclude_unset=True))
