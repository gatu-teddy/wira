from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from services.claude import match_candidate_to_job
from services.database import get_db
from services.auth import get_current_user
import uuid

router = APIRouter()


@router.post("/score")
def score_candidate_for_job(
    candidate_id: str,
    job_id: str,
    current_user=Depends(get_current_user),
):
    """Score a specific candidate against a specific job."""
    db = get_db()

    candidate_res = db.table("candidates").select("*").eq("id", candidate_id).execute()
    job_res = db.table("jobs").select("*").eq("id", job_id).execute()

    if not candidate_res.data:
        raise HTTPException(status_code=404, detail="Candidate not found")
    if not job_res.data:
        raise HTTPException(status_code=404, detail="Job not found")

    result = match_candidate_to_job(candidate_res.data[0], job_res.data[0])
    if not result:
        raise HTTPException(status_code=422, detail="Matching failed")

    match_record = {"id": str(uuid.uuid4()), "candidate_id": candidate_id, "job_id": job_id, **result}
    db.table("matches").upsert(match_record, on_conflict="candidate_id,job_id").execute()
    return match_record


@router.get("/my-matches")
def get_my_matches(current_user=Depends(get_current_user)):
    """Get all job matches for the current seeker."""
    db = get_db()
    candidate_res = db.table("candidates").select("id").eq("user_id", current_user.id).execute()
    if not candidate_res.data:
        raise HTTPException(status_code=404, detail="Profile not found")

    matches = (
        db.table("matches")
        .select("*, jobs(*)")
        .eq("candidate_id", candidate_res.data[0]["id"])
        .order("overall_score", desc=True)
        .execute()
    )
    return {"matches": matches.data}


@router.post("/run-all/{job_id}")
def match_all_candidates_to_job(
    job_id: str,
    background_tasks: BackgroundTasks,
    current_user=Depends(get_current_user),
):
    """(Employer) Score ALL candidates against a job — runs in background."""
    db = get_db()
    role = current_user.user_metadata.get("account_type") or current_user.app_metadata.get("role")
    if role != "employer":
        raise HTTPException(status_code=403, detail="Employers only")

    job_res = db.table("jobs").select("*").eq("id", job_id).execute()
    if not job_res.data:
        raise HTTPException(status_code=404, detail="Job not found")

    job = job_res.data[0]
    candidates = db.table("candidates").select("*").execute().data

    def run_matches():
        for candidate in candidates:
            result = match_candidate_to_job(candidate, job)
            if result:
                match_record = {
                    "id": str(uuid.uuid4()),
                    "candidate_id": candidate["id"],
                    "job_id": job_id,
                    **result,
                }
                db.table("matches").upsert(match_record, on_conflict="candidate_id,job_id").execute()

    background_tasks.add_task(run_matches)
    return {"message": f"Matching {len(candidates)} candidates in background", "job_id": job_id}


@router.get("/shortlist/{job_id}")
def get_shortlist(job_id: str, min_score: int = 60, current_user=Depends(get_current_user)):
    """Get top candidates for a job filtered by minimum score."""
    db = get_db()
    matches = (
        db.table("matches")
        .select("*, candidates(*)")
        .eq("job_id", job_id)
        .gte("overall_score", min_score)
        .order("overall_score", desc=True)
        .execute()
    )
    return {"shortlist": matches.data, "count": len(matches.data)}
