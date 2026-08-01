from __future__ import annotations
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.db.engine import get_db
from app.core.config import settings
from app.core.security import decode_access_token
from app.core.errors import ForbiddenError
from app.models.user import User, UserRole
from app.repositories import user_repo

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_PREFIX}/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    payload = decode_access_token(token)
    if not payload:
        raise ForbiddenError("Could not validate credentials")
    user_id = payload.get("sub")
    if not user_id:
        raise ForbiddenError("Could not validate credentials")
    user = user_repo.get_by_id(db, user_id)
    if not user:
        raise ForbiddenError("User not found")
    return user

def get_current_active_user(user: User = Depends(get_current_user)) -> User:
    if not user.is_active:
        raise ForbiddenError("Inactive user")
    return user

def require_role(*roles: str):
    def role_checker(user: User = Depends(get_current_active_user)) -> User:
        if user.role not in roles:
            raise ForbiddenError("Not enough permissions")
        return user
    return role_checker

get_admin_user = require_role(UserRole.ADMIN.value)
get_staff_user = require_role(UserRole.ADMIN.value, UserRole.LIBRARIAN.value)
