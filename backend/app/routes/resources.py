from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models import Community, User
from ..auth import get_current_active_user
from ..schemas import CommunityResponse

router = APIRouter()

@router.get("/", response_model=List[CommunityResponse])
def get_communities(db: Session = Depends(get_db)):
    communities = db.query(Community).all()
    return communities

@router.post("/{community_id}/join")
def join_community(community_id: int, current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    community = db.query(Community).filter(Community.id == community_id).first()
    if not community:
        raise HTTPException(status_code=404, detail="Community not found")
    
    if current_user not in community.members:
        community.members.append(current_user)
        db.commit()
    
    return {"joined": True, "community": community.name}