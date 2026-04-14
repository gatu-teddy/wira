from fastapi import APIRouter, UploadFile, File, HTTPException, Header
from services.claude import parse_resume
from services.database import get_db
import uuid

router = APIRouter()

ALLOWED_TYPES = {
    "application/pdf": "application/pdf",
    "image/png": "image/png",
    "image/jpeg": "image/jpeg",
    "image/webp": "image/webp",
}

@router.post("/upload-resume")
async def upload_resume(
    file: UploadFile = File(...),
    authorization: str = Header(...)
):
    """Upload a resume PDF or image. Claude parses it and stores the profile."""
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Unsupported file type. Use PDF, PNG, JPEG, or WebP.")

    file_bytes = await file.read()
    if len(file_bytes) > 10 * 1024 * 1024:  # 10MB limit
        raise HTTPException(status_code=400, detail="File too large. Max 10MB.")

    # Parse with Claude
    parsed = parse_resume(file_bytes, ALLOWED_TYPES[file.content_type])
    if not parsed:
        raise HTTPException(status_code=422, detail="Could not extract data from resume.")

    # Get user from token
    db = get_db()
    token = authorization.replace("Bearer ", "")
    user = db.auth.get_user(token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")

    user_id = user.user.id

    # Upsert into candidates table
    profile_data = {**parsed, "user_id": user_id}
    existing = db.table("candidates").select("id").eq("user_id", user_id).execute()

    if existing.data:
        db.table("candidates").update(profile_data).eq("user_id", user_id).execute()
        profile_id = existing.data[0]["id"]
    else:
        profile_id = str(uuid.uuid4())
        db.table("candidates").insert({**profile_data, "id": profile_id}).execute()

    return {"profile_id": profile_id, "parsed": parsed}


@router.get("/profile")
def get_my_profile(authorization: str = Header(...)):
    db = get_db()
    token = authorization.replace("Bearer ", "")
    user = db.auth.get_user(token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")

    result = db.table("candidates").select("*").eq("user_id", user.user.id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Profile not found. Upload your resume first.")
    return result.data[0]
