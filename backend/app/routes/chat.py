from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User, Message
from ..auth import get_current_active_user
from ..schemas import MessageCreate, MessageResponse

router = APIRouter()

@router.get("/conversations")
def get_conversations(current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    # Get all unique users you've chatted with
    sent_to = db.query(Message.receiver_id).filter(Message.sender_id == current_user.id).distinct()
    received_from = db.query(Message.sender_id).filter(Message.receiver_id == current_user.id).distinct()
    
    user_ids = set([id[0] for id in sent_to] + [id[0] for id in received_from])
    
    conversations = []
    for user_id in user_ids:
        user = db.query(User).filter(User.id == user_id).first()
        if user:
            last_message = db.query(Message).filter(
                ((Message.sender_id == current_user.id) & (Message.receiver_id == user_id)) |
                ((Message.sender_id == user_id) & (Message.receiver_id == current_user.id))
            ).order_by(Message.created_at.desc()).first()
            
            conversations.append({
                "user": user,
                "last_message": last_message.content if last_message else "",
                "unread": False
            })
    
    return conversations

@router.post("/send")
def send_message(message: MessageCreate, current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    db_message = Message(
        content=message.content,
        sender_id=current_user.id,
        receiver_id=message.receiver_id
    )
    
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    
    return db_message