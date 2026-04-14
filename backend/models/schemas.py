from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# ── Auth
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    account_type: str  # "seeker" | "employer"

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# ── Jobs
class JobCreate(BaseModel):
    title: str
    description: str
    required_skills: list[str]
    salary_min: int
    salary_max: int
    salary_currency: str = "USD"
    location: str
    remote: bool = False
    experience_years_min: int = 0
    experience_years_max: int = 20

class JobOut(JobCreate):
    id: str
    employer_id: str
    company_name: str
    created_at: datetime

# ── Candidates
class CandidateProfileOut(BaseModel):
    id: str
    user_id: str
    full_name: str
    email: Optional[str]
    phone: Optional[str]
    location: Optional[str]
    summary: Optional[str]
    skills: list[str]
    years_experience: float
    experience: list[dict]
    education: list[dict]
    created_at: datetime

# ── Matching
class MatchResult(BaseModel):
    candidate_id: str
    job_id: str
    overall_score: float
    skills_score: float
    experience_score: float
    key_strengths: list[str]
    gaps: list[str]
    recommendation: str
    summary: str
