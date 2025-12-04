from sqlalchemy.orm import Session
from datetime import datetime, timedelta

class StreakService:
    def __init__(self, db: Session):
        self.db = db
    
    def update_streak(self, user_id: int):
        """Update user's learning streak"""
        from ..models import UserProfile
        
        profile = self.db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
        
        if not profile:
            return 0
        
        today = datetime.utcnow().date()
        last_active = profile.last_active.date() if profile.last_active else None
        
        if last_active:
            days_since_last_active = (today - last_active).days
            
            if days_since_last_active == 1:
                # Consecutive day
                profile.streak_days += 1
            elif days_since_last_active > 1:
                # Streak broken
                profile.streak_days = 1
            # Same day, do nothing
        else:
            # First activity
            profile.streak_days = 1
        
        profile.last_active = datetime.utcnow()
        self.db.commit()
        
        return profile.streak_days
    
    def check_for_badges(self, user_id: int):
        """Check and award badges based on streak"""
        from ..models import UserProfile
        
        profile = self.db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
        
        if not profile:
            return []
        
        badges = []
        current_badges = profile.badges.split(",") if profile.badges else []
        
        # Streak badges
        if profile.streak_days >= 7 and "7-day-streak" not in current_badges:
            badges.append("7-day-streak")
        
        if profile.streak_days >= 30 and "30-day-streak" not in current_badges:
            badges.append("30-day-streak")
        
        # Update badges if new ones earned
        if badges:
            all_badges = current_badges + badges
            profile.badges = ",".join(all_badges)
            self.db.commit()
        
        return badges