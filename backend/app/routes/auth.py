from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import List

from ..database import get_db
from ..models import User, UserProfile, Community
from ..auth import (
    verify_password, get_password_hash, create_access_token,
    ACCESS_TOKEN_EXPIRE_MINUTES, get_current_user, get_current_active_user
)
from ..schemas import (
    UserCreate, UserResponse, Token, LoginRequest,
    OnboardingRequest
)

router = APIRouter()

@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user exists
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    db_username = db.query(User).filter(User.username == user.username).first()
    if db_username:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    # Create new user
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        username=user.username,
        full_name=user.full_name,
        hashed_password=hashed_password,
        user_type=user.user_type,
        level=user.level
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Create user profile
    profile = UserProfile(user_id=db_user.id)
    db.add(profile)
    db.commit()
    
    return db_user

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/onboarding")
def onboarding(data: OnboardingRequest, current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    # Update user with onboarding data
    current_user.subjects = ",".join(data.subjects)
    current_user.level = data.level
    
    # Join selected communities
    for community_name in data.communities:
        community = db.query(Community).filter(Community.name == community_name).first()
        if community:
            current_user.communities.append(community)
    
    db.commit()
    return {"message": "Onboarding completed successfully"}

@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user