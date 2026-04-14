from fastapi import APIRouter, HTTPException, Header, BackgroundTasks
from services.claude import match_candidate_to_job
from services.database import get_db
import uuid

router = APIRouter()

@router.post("/score")
def score_candidate_for_job(
    candidate_id: str,
    job_id: str,
    authorization: str = Header(...)
):
    """Score a specific candidate against a specific job. Returns match result."""
    db = get_db()
    token = authorization.replace("Bearer ", "")
    user = db.auth.get_user(token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")

    # Fetch candidate and job
    candidate_res = db.table("candidates").select("*").eq("id", candidate_id).execute()
    job_res = db.table("jobs").select("*").eq("id", job_id).execute()

    if not candidate_res.data:
        raise HTTPException(status_code=404, detail="Candidate not found")
    if not job_res.data:
        raise HTTPException(status_code=404, detail="Job not found")

    candidate = candidate_res.data[0]
    job = job_res.data[0]

    # Run Claude matching
    result = match_candidate_to_job(candidate, job)
    if not result:
        raise HTTPException(status_code=422, detail="Matching failed")

    # Store result
    match_record = {
        "id": str(uuid.uuid4()),
        "candidate_id": candidate_id,
        "job_id": job_id,
        **result
    }
    db.table("matches").upsert(match_record, on_conflict="candidate_id,job_id").execute()

    return match_record


@router.get("/my-matches")
def get_my_matches(authorization: str = Header(...)):
    """Get all job matches for the current candidate."""
    db = get_db()
    token = authorization.replace("Bearer ", "")
    user = db.auth.get_user(token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")

    candidate_res = db.table("candidates").select("id").eq("user_id", user.user.id).execute()
    if not candidate_res.data:
        raise HTTPException(status_code=404, detail="Profile not found")

    candidate_id = candidate_res.data[0]["id"]
    matches = db.table("matches").select("*, jobs(*)").eq("candidate_id", candidate_id).order("overall_score", desc=True).execute()

    return {"matches": matches.data}


@router.post("/run-all-matches/{job_id}")
def match_all_candidates_to_job(job_id: str, authorization: str = Header(...), background_tasks: BackgroundTasks = None):
    """(Employer) Score ALL candidates against a job. Runs in background."""
    db = get_db()
    token = authorization.replace("Bearer ", "")
    user = db.auth.get_user(token)
    if not user or user.user.user_metadata.get("account_type") != "employer":
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
                    **result
                }
                db.table("matches").upsert(match_record, on_conflict="candidate_id,job_id").execute()

    background_tasks.add_task(run_matches)
    return {"message": f"Matching {len(candidates)} candidates in background", "job_id": job_id}


@router.get("/shortlist/{job_id}")
def get_shortlist(job_id: str, authorization: str = Header(...), min_score: int = 60):
    """Get top candidates for a job, filtered by minimum score."""
    db = get_db()
    token = authorization.replace("Bearer ", "")
    user = db.auth.get_user(token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")

    matches = (
        db.table("matches")
        .select("*, candidates(*)")
        .eq("job_id", job_id)
        .gte("overall_score", min_score)
        .order("overall_score", desc=True)
        .execute()
    )

    return {"shortlist": matches.data, "count": len(matches.data)}
