from fastapi import APIRouter, HTTPException, Depends
from models.schemas import RegisterRequest, LoginRequest
from services.database import get_db
from services.auth import get_current_user

router = APIRouter()


@router.post("/register", status_code=201)
def register(body: RegisterRequest):
    if body.account_type not in ("seeker", "employer"):
        raise HTTPException(status_code=400, detail="account_type must be 'seeker' or 'employer'")
    if body.account_type == "employer" and not body.company_name:
        raise HTTPException(status_code=400, detail="company_name is required for employers")

    db = get_db()
    try:
        res = db.auth.sign_up({
            "email": body.email,
            "password": body.password,
            "options": {
                "data": {
                    "full_name": body.full_name,
                    "account_type": body.account_type,
                }
            },
        })
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    user_id = res.user.id

    # Create profile row
    profile = {
        "id": user_id,
        "role": body.account_type,
        "full_name": body.full_name,
        "company_name": body.company_name,
        "company_website": body.company_website,
    }
    db.table("profiles").upsert(profile).execute()

    return {"user_id": user_id, "email": res.user.email, "role": body.account_type}


@router.post("/login")
def login(body: LoginRequest):
    db = get_db()
    try:
        res = db.auth.sign_in_with_password({"email": body.email, "password": body.password})
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    profile = db.table("profiles").select("role, full_name, company_name").eq("id", res.user.id).maybe_single().execute()

    return {
        "access_token": res.session.access_token,
        "refresh_token": res.session.refresh_token,
        "token_type": "bearer",
        "user_id": res.user.id,
        "email": res.user.email,
        "role": profile.data.get("role") if profile.data else res.user.user_metadata.get("account_type"),
        "full_name": profile.data.get("full_name") if profile.data else None,
        "company_name": profile.data.get("company_name") if profile.data else None,
    }


@router.post("/refresh")
def refresh_token(refresh_token: str):
    db = get_db()
    try:
        res = db.auth.refresh_session(refresh_token)
        return {
            "access_token": res.session.access_token,
            "refresh_token": res.session.refresh_token,
            "token_type": "bearer",
        }
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")


@router.post("/logout")
def logout(current_user=Depends(get_current_user)):
    db = get_db()
    db.auth.sign_out()
    return {"message": "Logged out"}


@router.get("/me")
def get_me(current_user=Depends(get_current_user)):
    db = get_db()
    profile = db.table("profiles").select("*").eq("id", current_user.id).maybe_single().execute()
    return {
        "user_id": current_user.id,
        "email": current_user.email,
        "profile": profile.data,
    }
