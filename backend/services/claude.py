import anthropic
import base64
from config import settings

client = anthropic.Anthropic(api_key=settings.anthropic_api_key)

RESUME_TOOL = {
    "name": "extract_resume",
    "description": "Extract structured data from a resume document",
    "input_schema": {
        "type": "object",
        "properties": {
            "full_name":   {"type": "string"},
            "email":       {"type": "string"},
            "phone":       {"type": "string"},
            "location":    {"type": "string"},
            "summary":     {"type": "string", "description": "2-3 sentence professional summary"},
            "skills":      {"type": "array", "items": {"type": "string"}},
            "years_experience": {"type": "number"},
            "experience": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "company":      {"type": "string"},
                        "role":         {"type": "string"},
                        "start_date":   {"type": "string"},
                        "end_date":     {"type": "string"},
                        "current":      {"type": "boolean"},
                        "description":  {"type": "string"}
                    }
                }
            },
            "education": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "institution": {"type": "string"},
                        "degree":      {"type": "string"},
                        "field":       {"type": "string"},
                        "year":        {"type": "string"}
                    }
                }
            }
        },
        "required": ["full_name", "skills", "experience", "years_experience"]
    }
}

MATCH_TOOL = {
    "name": "evaluate_fit",
    "description": "Score a candidate's fit for a job posting",
    "input_schema": {
        "type": "object",
        "properties": {
            "overall_score":      {"type": "number", "description": "0-100 overall compatibility score"},
            "skills_score":       {"type": "number", "description": "0-100 skills match score"},
            "experience_score":   {"type": "number", "description": "0-100 experience level match"},
            "key_strengths":      {"type": "array", "items": {"type": "string"}, "description": "Top 3 reasons this is a good match"},
            "gaps":               {"type": "array", "items": {"type": "string"}, "description": "Missing skills or experience"},
            "recommendation":     {"type": "string", "enum": ["strong_match", "good_fit", "possible_fit", "not_suitable"]},
            "summary":            {"type": "string", "description": "2-3 sentence plain-English explanation of the match"}
        },
        "required": ["overall_score", "skills_score", "experience_score", "key_strengths", "gaps", "recommendation", "summary"]
    }
}


def parse_resume(file_bytes: bytes, media_type: str) -> dict:
    """Parse a resume PDF or image and return structured data."""
    encoded = base64.standard_b64encode(file_bytes).decode("utf-8")

    content_block = (
        {"type": "document", "source": {"type": "base64", "media_type": media_type, "data": encoded}}
        if media_type == "application/pdf"
        else {"type": "image", "source": {"type": "base64", "media_type": media_type, "data": encoded}}
    )

    response = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=2048,
        tools=[RESUME_TOOL],
        tool_choice={"type": "tool", "name": "extract_resume"},
        messages=[{
            "role": "user",
            "content": [
                {"type": "text", "text": "Extract all information from this resume."},
                content_block
            ]
        }]
    )

    for block in response.content:
        if block.type == "tool_use" and block.name == "extract_resume":
            return block.input

    return {}


def match_candidate_to_job(candidate_profile: dict, job: dict) -> dict:
    """Score a candidate against a job description. Returns structured match result."""
    response = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=1024,
        tools=[MATCH_TOOL],
        tool_choice={"type": "tool", "name": "evaluate_fit"},
        messages=[{
            "role": "user",
            "content": f"""Evaluate this candidate's fit for the job.

CANDIDATE PROFILE:
Name: {candidate_profile.get('full_name')}
Skills: {', '.join(candidate_profile.get('skills', []))}
Years experience: {candidate_profile.get('years_experience')}
Summary: {candidate_profile.get('summary')}
Experience: {candidate_profile.get('experience')}

JOB POSTING:
Title: {job.get('title')}
Company: {job.get('company_name')}
Description: {job.get('description')}
Required skills: {job.get('required_skills')}
Salary range: {job.get('salary_min')} - {job.get('salary_max')} {job.get('salary_currency', 'USD')}
Experience required: {job.get('experience_years_min', 0)}-{job.get('experience_years_max', 99)} years"""
        }]
    )

    for block in response.content:
        if block.type == "tool_use" and block.name == "evaluate_fit":
            return block.input

    return {}
