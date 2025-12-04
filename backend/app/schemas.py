from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None
    user_type: Optional[str] = "student"      # Add this
    level: Optional[str] = None               # Add this
    subjects: Optional[List[str]] = []    # Add this

class UserCreate(UserBase):
    password: str
    user_type: str = "student"
    level: str = "Form 3"

class UserResponse(UserBase):
    id: int
    user_type: str
    level: Optional[str]
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Auth schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class LoginRequest(BaseModel):
    username: str
    password: str

class OnboardingRequest(BaseModel):
    subjects: List[str]
    level: str
    communities: List[str]

# Post schemas
class PostBase(BaseModel):
    content: str
    image_url: Optional[str] = None
    community_id: int
    subject: str
    tags: Optional[List[str]] = None

class PostCreate(PostBase):
    pass

class PostResponse(PostBase):
    id: int
    author_id: int
    like_count: int
    comment_count: int
    created_at: datetime
    author: UserResponse
    
    class Config:
        from_attributes = True

# Comment schemas
class CommentBase(BaseModel):
    content: str

class CommentCreate(CommentBase):
    pass

class CommentResponse(CommentBase):
    id: int
    author_id: int
    post_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Community schemas
class CommunityBase(BaseModel):
    name: str
    description: str
    subject: str
    level: str
    is_teacher_led: bool = False

class CommunityCreate(CommunityBase):
    pass

class CommunityResponse(CommunityBase):
    id: int
    member_count: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Resource schemas
class ResourceBase(BaseModel):
    title: str
    description: Optional[str] = None
    file_type: str
    subject: str
    level: str

class ResourceCreate(ResourceBase):
    pass

class ResourceResponse(ResourceBase):
    id: int
    file_url: str
    download_count: int
    uploaded_by: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Message schemas
class MessageBase(BaseModel):
    content: str
    receiver_id: int

class MessageCreate(MessageBase):
    pass

class MessageResponse(BaseModel):
    id: int
    content: str
    sender_id: int
    receiver_id: int
    is_read: bool
    created_at: datetime
    
    class Config:
        from_attributes = True