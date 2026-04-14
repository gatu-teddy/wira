from fastapi import APIRouter, HTTPException
from models.schemas import RegisterRequest, LoginRequest
from services.database import get_db

router = APIRouter()

@router.post("/register")
def register(body: RegisterRequest):
    db = get_db()
    try:
        res = db.auth.sign_up({
            "email": body.email,
            "password": body.password,
            "options": {"data": {"full_name": body.full_name, "account_type": body.account_type}}
        })
        return {"user_id": res.user.id, "email": res.user.email}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login")
def login(body: LoginRequest):
    db = get_db()
    try:
        res = db.auth.sign_in_with_password({"email": body.email, "password": body.password})
        return {
            "access_token": res.session.access_token,
            "token_type": "bearer",
            "user_id": res.user.id,
            "account_type": res.user.user_metadata.get("account_type")
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid credentials")

@router.post("/logout")
def logout():
    db = get_db()
    db.auth.sign_out()
    return {"message": "Logged out"}
