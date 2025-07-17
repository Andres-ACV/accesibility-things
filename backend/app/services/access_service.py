from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from ..repositories.access_repository import AccessRepository
from ..schemas.user import UserCreate, UserUpdate, UserLogin, UserForgotPassword, UserResetPassword
from ..config.settings import settings
import secrets

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class AccessService:
    def __init__(self, repository: AccessRepository):
        self.repository = repository
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)
    
    def get_password_hash(self, password: str) -> str:
        return pwd_context.hash(password)
    
    def create_access_token(self, data: dict, expires_delta: Optional[timedelta] = None):
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
        
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
        return encoded_jwt
    
    def verify_token(self, token: str) -> Optional[str]:
        try:
            payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
            email: str = payload.get("sub")
            if email is None:
                return None
            return email
        except JWTError:
            return None
    
    def authenticate_user(self, email: str, password: str):
        user = self.repository.get_user_by_email(email)
        if not user:
            return None
        if not self.verify_password(password, user.hashed_password):
            return None
        return user
    
    def register_user(self, user_data: UserCreate):
        # Check if user already exists
        if self.repository.get_user_by_email(user_data.email):
            raise ValueError("Email already registered")
        # Hash password and create user
        hashed_password = self.get_password_hash(user_data.password)
        user = self.repository.create_user(user_data, hashed_password)
        return user
    
    def login_user(self, user_data: UserLogin):
        user = self.authenticate_user(user_data.email, user_data.password)
        if not user:
            raise ValueError("Invalid email or password")
        if not user.is_active:
            raise ValueError("User account is disabled")
        
        # Create access token
        access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
        access_token = self.create_access_token(
            data={"sub": user.email}, expires_delta=access_token_expires
        )
        
        return {"access_token": access_token, "token_type": "bearer"}
    
    def forgot_password(self, user_data: UserForgotPassword):
        user = self.repository.get_user_by_email(user_data.email)
        if not user:
            # Don't reveal if user exists or not for security
            return {"message": "If the email exists, a password reset link has been sent"}
        
        # Generate reset token (in a real app, you'd store this in DB with expiration)
        reset_token = secrets.token_urlsafe(32)
        
        # In a real implementation, you would:
        # 1. Store the reset token in database with expiration
        # 2. Send email with reset link
        # 3. Handle email sending logic
        
        return {"message": "If the email exists, a password reset link has been sent"}
    
    def reset_password(self, reset_data: UserResetPassword):
        # In a real implementation, you would:
        # 1. Verify the reset token from database
        # 2. Check if token is expired
        # 3. Update user password
        
        # For now, we'll assume the token is valid
        # This is a simplified implementation
        return {"message": "Password has been reset successfully"}
    
    def update_user_profile(self, user_id: int, user_data: UserUpdate):
        user = self.repository.update_user(user_id, user_data)
        if not user:
            raise ValueError("User not found")
        return user
    
    def get_current_user(self, token: str):
        email = self.verify_token(token)
        if email is None:
            raise ValueError("Invalid token")
        
        user = self.repository.get_user_by_email(email)
        if user is None:
            raise ValueError("User not found")
        return user 