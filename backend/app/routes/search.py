from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_

from ..database import get_db
from ..models import Post, User, Community, Resource
from ..auth import get_current_active_user

router = APIRouter()

@router.get("/")
def search(
    q: str = Query(..., min_length=1),
    type: str = Query("all", regex="^(all|posts|users|communities|resources)$"),
    db: Session = Depends(get_db)
):
    results = {}
    
    if type in ["all", "posts"]:
        posts = db.query(Post).filter(
            or_(
                Post.content.ilike(f"%{q}%"),
                Post.tags.ilike(f"%{q}%")
            )
        ).limit(10).all()
        results["posts"] = posts
    
    if type in ["all", "users"]:
        users = db.query(User).filter(
            or_(
                User.username.ilike(f"%{q}%"),
                User.full_name.ilike(f"%{q}%")
            )
        ).limit(10).all()
        results["users"] = users
    
    if type in ["all", "communities"]:
        communities = db.query(Community).filter(
            or_(
                Community.name.ilike(f"%{q}%"),
                Community.description.ilike(f"%{q}%"),
                Community.subject.ilike(f"%{q}%")
            )
        ).limit(10).all()
        results["communities"] = communities
    
    if type in ["all", "resources"]:
        resources = db.query(Resource).filter(
            or_(
                Resource.title.ilike(f"%{q}%"),
                Resource.description.ilike(f"%{q}%"),
                Resource.subject.ilike(f"%{q}%")
            )
        ).limit(10).all()
        results["resources"] = resources
    
    return results