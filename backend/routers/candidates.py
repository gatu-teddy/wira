from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from models.schemas import CandidateProfileUpdate
from services.claude import parse_resume
from services.database import get_db
from services.auth import get_current_user

router = APIRouter()

ALLOWED_TYPES = {
    "application/pdf": "application/pdf",
    "image/png":       "image/png",
    "image/jpeg":      "image/jpeg",
    "image/webp":      "image/webp",
}


@router.post("/upload-resume", status_code=201)
async def upload_resume(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user),
):
    """Upload a resume PDF or image — Claude parses it and upserts the candidate profile."""
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Unsupported file type. Use PDF, PNG, JPEG, or WebP.")

    file_bytes = await file.read()
    if len(file_bytes) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large. Max 10MB.")

    parsed = parse_resume(file_bytes, ALLOWED_TYPES[file.content_type])
    if not parsed:
        raise HTTPException(status_code=422, detail="Could not extract data from resume.")

    db = get_db()
    user_id = current_user.id
    profile_data = {**parsed, "user_id": user_id}

    existing = db.table("candidates").select("id").eq("user_id", user_id).execute()
    if existing.data:
        db.table("candidates").update(profile_data).eq("user_id", user_id).execute()
        profile_id = existing.data[0]["id"]
    else:
        import uuid
        profile_id = str(uuid.uuid4())
        db.table("candidates").insert({**profile_data, "id": profile_id}).execute()

    return {"profile_id": profile_id, "parsed": parsed}


@router.get("/profile")
def get_my_profile(current_user=Depends(get_current_user)):
    db = get_db()
    result = db.table("candidates").select("*").eq("user_id", current_user.id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Profile not found. Upload your resume first.")
    return result.data[0]


@router.patch("/profile")
def update_my_profile(body: CandidateProfileUpdate, current_user=Depends(get_current_user)):
    """Manually update candidate profile fields without re-uploading resume."""
    db = get_db()
    updates = body.model_dump(exclude_none=True)
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")

    existing = db.table("candidates").select("id").eq("user_id", current_user.id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Profile not found. Upload your resume first.")

    db.table("candidates").update(updates).eq("user_id", current_user.id).execute()
    result = db.table("candidates").select("*").eq("user_id", current_user.id).execute()
    return result.data[0]
