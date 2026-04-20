from fastapi import APIRouter, HTTPException, Depends
from models.schemas import JobCreate, JobUpdate
from services.database import get_db
from services.auth import get_current_user
import uuid

router = APIRouter()


def _require_employer(current_user):
    role = current_user.user_metadata.get("account_type") or \
           current_user.app_metadata.get("role")
    if role != "employer":
        raise HTTPException(status_code=403, detail="Only employers can perform this action")


@router.post("/", status_code=201)
def create_job(body: JobCreate, current_user=Depends(get_current_user)):
    _require_employer(current_user)
    db = get_db()

    # Pull company_name from profiles table (source of truth)
    profile = db.table("profiles").select("company_name").eq("id", current_user.id).maybe_single().execute()
    company_name = (profile.data or {}).get("company_name") or "Unknown Company"

    job = {
        "id": str(uuid.uuid4()),
        "employer_id": current_user.id,
        "company_name": company_name,
        **body.model_dump(),
    }
    db.table("jobs").insert(job).execute()
    return {"job_id": job["id"], "job": job}


@router.get("/")
def list_jobs(limit: int = 20, offset: int = 0, remote: bool = None, location: str = None):
    db = get_db()
    query = db.table("jobs").select("*").eq("is_active", True).order("created_at", desc=True)
    if remote is not None:
        query = query.eq("remote", remote)
    if location:
        query = query.ilike("location", f"%{location}%")
    result = query.range(offset, offset + limit - 1).execute()
    return {"jobs": result.data, "total": len(result.data)}


@router.get("/my-jobs")
def list_my_jobs(current_user=Depends(get_current_user)):
    _require_employer(current_user)
    db = get_db()
    result = db.table("jobs").select("*").eq("employer_id", current_user.id).order("created_at", desc=True).execute()
    return {"jobs": result.data}


@router.get("/{job_id}")
def get_job(job_id: str):
    db = get_db()
    result = db.table("jobs").select("*").eq("id", job_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Job not found")
    return result.data[0]


@router.patch("/{job_id}")
def update_job(job_id: str, body: JobUpdate, current_user=Depends(get_current_user)):
    _require_employer(current_user)
    db = get_db()
    updates = body.model_dump(exclude_none=True)
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")

    existing = db.table("jobs").select("id").eq("id", job_id).eq("employer_id", current_user.id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Job not found or not yours")

    db.table("jobs").update(updates).eq("id", job_id).execute()
    result = db.table("jobs").select("*").eq("id", job_id).execute()
    return result.data[0]


@router.delete("/{job_id}", status_code=204)
def delete_job(job_id: str, current_user=Depends(get_current_user)):
    _require_employer(current_user)
    db = get_db()
    db.table("jobs").delete().eq("id", job_id).eq("employer_id", current_user.id).execute()
