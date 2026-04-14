from fastapi import APIRouter, HTTPException, Header
from models.schemas import JobCreate
from services.database import get_db
import uuid

router = APIRouter()

@router.post("/")
def create_job(body: JobCreate, authorization: str = Header(...)):
    db = get_db()
    token = authorization.replace("Bearer ", "")
    user = db.auth.get_user(token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")

    user_meta = user.user.user_metadata
    if user_meta.get("account_type") != "employer":
        raise HTTPException(status_code=403, detail="Only employers can post jobs")

    job_id = str(uuid.uuid4())
    job = {
        "id": job_id,
        "employer_id": user.user.id,
        "company_name": user_meta.get("company_name", "Unknown Company"),
        **body.model_dump()
    }
    db.table("jobs").insert(job).execute()
    return {"job_id": job_id, "job": job}


@router.get("/")
def list_jobs(limit: int = 20, offset: int = 0):
    db = get_db()
    result = db.table("jobs").select("*").order("created_at", desc=True).range(offset, offset + limit - 1).execute()
    return {"jobs": result.data, "total": len(result.data)}


@router.get("/{job_id}")
def get_job(job_id: str):
    db = get_db()
    result = db.table("jobs").select("*").eq("id", job_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Job not found")
    return result.data[0]


@router.delete("/{job_id}")
def delete_job(job_id: str, authorization: str = Header(...)):
    db = get_db()
    token = authorization.replace("Bearer ", "")
    user = db.auth.get_user(token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")

    db.table("jobs").delete().eq("id", job_id).eq("employer_id", user.user.id).execute()
    return {"message": "Job deleted"}
