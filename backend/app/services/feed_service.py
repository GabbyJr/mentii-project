from sqlalchemy.orm import Session
from ..models import Post, User
from datetime import datetime, timedelta

class FeedService:
    def __init__(self, db: Session):
        self.db = db
    
    def get_personalized_feed(self, user_id: int, page: int = 1, limit: int = 10):
        """Get personalized feed for user based on their communities and interests"""
        user = self.db.query(User).filter(User.id == user_id).first()
        
        if not user:
            return []
        
        # Get posts from user's communities, ordered by engagement
        posts = self.db.query(Post).filter(
            Post.community_id.in_([c.id for c in user.communities])
        ).order_by(
            Post.created_at.desc()
        ).offset((page - 1) * limit).limit(limit).all()
        
        return posts
    
    def get_trending_posts(self, limit: int = 10):
        """Get trending posts (most liked in last 24 hours)"""
        yesterday = datetime.utcnow() - timedelta(days=1)
        
        posts = self.db.query(Post).filter(
            Post.created_at >= yesterday
        ).order_by(
            Post.like_count.desc()
        ).limit(limit).all()
        
        return posts