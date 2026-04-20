from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


# ── Auth ──────────────────────────────────────────────────────────
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    account_type: str       # "seeker" | "employer"
    company_name: Optional[str] = None   # required when account_type == "employer"
    company_website: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class ProfileOut(BaseModel):
    id: str
    role: str
    full_name: Optional[str]
    company_name: Optional[str]
    company_website: Optional[str]
    avatar_url: Optional[str]
    created_at: datetime


# ── Jobs ──────────────────────────────────────────────────────────
class JobCreate(BaseModel):
    title: str
    description: str
    required_skills: list[str] = []
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    salary_currency: str = "USD"
    location: Optional[str] = None
    remote: bool = False
    experience_years_min: int = 0
    experience_years_max: int = 20


class JobUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    required_skills: Optional[list[str]] = None
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    salary_currency: Optional[str] = None
    location: Optional[str] = None
    remote: Optional[bool] = None
    experience_years_min: Optional[int] = None
    experience_years_max: Optional[int] = None
    is_active: Optional[bool] = None


class JobOut(BaseModel):
    id: str
    employer_id: str
    company_name: str
    title: str
    description: str
    required_skills: list[str]
    salary_min: Optional[int]
    salary_max: Optional[int]
    salary_currency: str
    location: Optional[str]
    remote: bool
    experience_years_min: int
    experience_years_max: int
    is_active: bool
    created_at: datetime


# ── Candidates ────────────────────────────────────────────────────
class CandidateProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    summary: Optional[str] = None
    skills: Optional[list[str]] = None
    years_experience: Optional[float] = None
    experience: Optional[list[dict]] = None
    education: Optional[list[dict]] = None


class CandidateProfileOut(BaseModel):
    id: str
    user_id: str
    full_name: Optional[str]
    email: Optional[str]
    phone: Optional[str]
    location: Optional[str]
    summary: Optional[str]
    skills: list[str]
    years_experience: float
    experience: list[dict]
    education: list[dict]
    created_at: datetime


# ── Matching ──────────────────────────────────────────────────────
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


# ── Applications ──────────────────────────────────────────────────
class ApplicationCreate(BaseModel):
    job_id: str
    cover_note: Optional[str] = None


class ApplicationStatusUpdate(BaseModel):
    status: str   # shortlisted | interviewed | offered | rejected


class ApplicationOut(BaseModel):
    id: str
    candidate_id: str
    job_id: str
    status: str
    cover_note: Optional[str]
    created_at: datetime
    updated_at: datetime


# ── Messages ──────────────────────────────────────────────────────
class ConversationCreate(BaseModel):
    other_user_id: str
    job_id: Optional[str] = None


class MessageCreate(BaseModel):
    body: str


class MessageOut(BaseModel):
    id: str
    conversation_id: str
    sender_id: str
    body: str
    read_at: Optional[datetime]
    created_at: datetime


class ConversationOut(BaseModel):
    id: str
    seeker_id: str
    employer_id: str
    job_id: Optional[str]
    created_at: datetime


# ── Skills ────────────────────────────────────────────────────────
class SkillOut(BaseModel):
    id: int
    name: str
    category: Optional[str]
