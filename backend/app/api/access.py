from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from ..config.database import get_db
from ..repositories.access_repository import AccessRepository
from ..services.access_service import AccessService
from ..schemas.user import (
    UserCreate, UserUpdate, UserLogin, UserForgotPassword, 
    UserResetPassword, UserResponse, Token
)

router = APIRouter(prefix="/auth", tags=["authentication"])
security = HTTPBearer()

def get_access_service(db: Session = Depends(get_db)) -> AccessService:
    repository = AccessRepository(db)
    return AccessService(repository)

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, service: AccessService = Depends(get_access_service)):
    """Create a new user account"""
    try:
        user = service.register_user(user_data)
        return user
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.post("/login", response_model=Token)
def login(user_data: UserLogin, service: AccessService = Depends(get_access_service)):
    """Login user and return access token"""
    try:
        token_data = service.login_user(user_data)
        return token_data
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"}
        )

@router.post("/forgot-password")
def forgot_password(
    user_data: UserForgotPassword, 
    service: AccessService = Depends(get_access_service)
):
    """Send password reset email"""
    result = service.forgot_password(user_data)
    return result

@router.post("/reset-password")
def reset_password(
    reset_data: UserResetPassword, 
    service: AccessService = Depends(get_access_service)
):
    """Reset password using token"""
    try:
        result = service.reset_password(reset_data)
        return result
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.put("/profile", response_model=UserResponse)
def update_profile(
    user_data: UserUpdate,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    service: AccessService = Depends(get_access_service)
):
    """Update user profile"""
    try:
        current_user = service.get_current_user(credentials.credentials)
        updated_user = service.update_user_profile(current_user.id, user_data)
        return updated_user
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.get("/profile", response_model=UserResponse)
def get_profile(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    service: AccessService = Depends(get_access_service)
):
    """Get current user profile"""
    try:
        current_user = service.get_current_user(credentials.credentials)
        return current_user
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"}
        ) 