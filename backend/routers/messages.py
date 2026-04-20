from fastapi import APIRouter, HTTPException, Depends
from models.schemas import ConversationCreate, MessageCreate
from services.database import get_db
from services.auth import get_current_user
import uuid

router = APIRouter()


def _get_or_create_conversation(db, seeker_id: str, employer_id: str, job_id: str | None) -> dict:
    query = (
        db.table("conversations")
        .select("*")
        .eq("seeker_id", seeker_id)
        .eq("employer_id", employer_id)
    )
    if job_id:
        query = query.eq("job_id", job_id)
    else:
        query = query.is_("job_id", "null")

    existing = query.execute()
    if existing.data:
        return existing.data[0]

    conv = {
        "id": str(uuid.uuid4()),
        "seeker_id": seeker_id,
        "employer_id": employer_id,
        "job_id": job_id,
    }
    db.table("conversations").insert(conv).execute()
    return conv


@router.get("/conversations")
def list_conversations(current_user=Depends(get_current_user)):
    """List all conversations the current user participates in."""
    db = get_db()
    uid = current_user.id
    result = (
        db.table("conversations")
        .select("*")
        .or_(f"seeker_id.eq.{uid},employer_id.eq.{uid}")
        .order("created_at", desc=True)
        .execute()
    )
    return {"conversations": result.data}


@router.post("/conversations", status_code=201)
def start_conversation(body: ConversationCreate, current_user=Depends(get_current_user)):
    """Start or retrieve a conversation with another user (optionally about a job)."""
    db = get_db()
    uid = current_user.id
    role = current_user.user_metadata.get("account_type") or current_user.app_metadata.get("role")

    # Determine seeker/employer assignment based on requester's role
    if role == "seeker":
        seeker_id, employer_id = uid, body.other_user_id
    else:
        seeker_id, employer_id = body.other_user_id, uid

    conv = _get_or_create_conversation(db, seeker_id, employer_id, body.job_id)
    return conv


@router.get("/conversations/{conversation_id}/messages")
def get_messages(conversation_id: str, current_user=Depends(get_current_user)):
    """Get all messages in a conversation (participants only)."""
    db = get_db()
    uid = current_user.id

    conv_res = db.table("conversations").select("*").eq("id", conversation_id).execute()
    if not conv_res.data:
        raise HTTPException(status_code=404, detail="Conversation not found")

    conv = conv_res.data[0]
    if conv["seeker_id"] != uid and conv["employer_id"] != uid:
        raise HTTPException(status_code=403, detail="Not a participant of this conversation")

    # Mark unread messages as read
    db.table("messages").update({"read_at": "now()"}).eq("conversation_id", conversation_id).neq("sender_id", uid).is_("read_at", "null").execute()

    result = (
        db.table("messages")
        .select("*")
        .eq("conversation_id", conversation_id)
        .order("created_at")
        .execute()
    )
    return {"messages": result.data}


@router.post("/conversations/{conversation_id}/messages", status_code=201)
def send_message(conversation_id: str, body: MessageCreate, current_user=Depends(get_current_user)):
    """Send a message in a conversation."""
    db = get_db()
    uid = current_user.id

    conv_res = db.table("conversations").select("seeker_id, employer_id").eq("id", conversation_id).execute()
    if not conv_res.data:
        raise HTTPException(status_code=404, detail="Conversation not found")

    conv = conv_res.data[0]
    if conv["seeker_id"] != uid and conv["employer_id"] != uid:
        raise HTTPException(status_code=403, detail="Not a participant of this conversation")

    message = {
        "id": str(uuid.uuid4()),
        "conversation_id": conversation_id,
        "sender_id": uid,
        "body": body.body,
    }
    db.table("messages").insert(message).execute()
    return message
