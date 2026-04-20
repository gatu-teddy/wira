from fastapi import APIRouter, HTTPException, Depends
from models.schemas import ApplicationCreate, ApplicationStatusUpdate
from services.database import get_db
from services.auth import get_current_user
import uuid

router = APIRouter()

VALID_STATUSES = {"shortlisted", "interviewed", "offered", "rejected"}


@router.post("/", status_code=201)
def apply_to_job(body: ApplicationCreate, current_user=Depends(get_current_user)):
    """Seeker applies to a job."""
    db = get_db()
    candidate_res = db.table("candidates").select("id").eq("user_id", current_user.id).execute()
    if not candidate_res.data:
        raise HTTPException(status_code=404, detail="Complete your profile before applying")

    candidate_id = candidate_res.data[0]["id"]

    # Check job exists
    job_res = db.table("jobs").select("id").eq("id", body.job_id).eq("is_active", True).execute()
    if not job_res.data:
        raise HTTPException(status_code=404, detail="Job not found")

    # Prevent duplicate
    existing = db.table("applications").select("id, status").eq("candidate_id", candidate_id).eq("job_id", body.job_id).execute()
    if existing.data:
        raise HTTPException(status_code=409, detail=f"Already applied (status: {existing.data[0]['status']})")

    application = {
        "id": str(uuid.uuid4()),
        "candidate_id": candidate_id,
        "job_id": body.job_id,
        "cover_note": body.cover_note,
    }
    db.table("applications").insert(application).execute()
    return application


@router.get("/")
def list_my_applications(current_user=Depends(get_current_user)):
    """Seeker: list all their applications with job details."""
    db = get_db()
    candidate_res = db.table("candidates").select("id").eq("user_id", current_user.id).execute()
    if not candidate_res.data:
        return {"applications": []}

    result = (
        db.table("applications")
        .select("*, jobs(id, title, company_name, location, remote, salary_min, salary_max, salary_currency)")
        .eq("candidate_id", candidate_res.data[0]["id"])
        .order("created_at", desc=True)
        .execute()
    )
    return {"applications": result.data}


@router.get("/job/{job_id}")
def list_job_applications(job_id: str, current_user=Depends(get_current_user)):
    """Employer: list all applications for one of their jobs."""
    db = get_db()
    job_res = db.table("jobs").select("id").eq("id", job_id).eq("employer_id", current_user.id).execute()
    if not job_res.data:
        raise HTTPException(status_code=404, detail="Job not found or not yours")

    result = (
        db.table("applications")
        .select("*, candidates(id, full_name, email, location, skills, years_experience, summary)")
        .eq("job_id", job_id)
        .order("created_at", desc=True)
        .execute()
    )
    return {"applications": result.data, "count": len(result.data)}


@router.patch("/{application_id}/status")
def update_application_status(
    application_id: str,
    body: ApplicationStatusUpdate,
    current_user=Depends(get_current_user),
):
    """Employer: move an application through the pipeline."""
    if body.status not in VALID_STATUSES:
        raise HTTPException(status_code=400, detail=f"status must be one of: {', '.join(VALID_STATUSES)}")

    db = get_db()
    # Verify the employer owns the job linked to this application
    app_res = db.table("applications").select("id, job_id").eq("id", application_id).execute()
    if not app_res.data:
        raise HTTPException(status_code=404, detail="Application not found")

    job_res = db.table("jobs").select("id").eq("id", app_res.data[0]["job_id"]).eq("employer_id", current_user.id).execute()
    if not job_res.data:
        raise HTTPException(status_code=403, detail="Not authorised to update this application")

    db.table("applications").update({"status": body.status}).eq("id", application_id).execute()
    return {"application_id": application_id, "status": body.status}


@router.delete("/{application_id}", status_code=204)
def withdraw_application(application_id: str, current_user=Depends(get_current_user)):
    """Seeker: withdraw their application."""
    db = get_db()
    candidate_res = db.table("candidates").select("id").eq("user_id", current_user.id).execute()
    if not candidate_res.data:
        raise HTTPException(status_code=404, detail="Profile not found")

    db.table("applications").update({"status": "withdrawn"}).eq("id", application_id).eq("candidate_id", candidate_res.data[0]["id"]).execute()
