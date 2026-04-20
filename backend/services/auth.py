from fastapi import Depends, Header, HTTPException
from services.database import get_db


def get_current_user(authorization: str = Header(...)):
    """FastAPI dependency — validates Bearer token, returns Supabase user object."""
    db = get_db()
    token = authorization.removeprefix("Bearer ").strip()
    try:
        res = db.auth.get_user(token)
        if not res or not res.user:
            raise HTTPException(status_code=401, detail="Invalid or expired token")
        return res.user
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


def require_role(role: str):
    """Factory — returns a dependency that enforces a specific role."""
    def _check(current_user=Depends(get_current_user)):
        actual = current_user.user_metadata.get("account_type") or \
                 current_user.app_metadata.get("role")
        if actual != role:
            raise HTTPException(status_code=403, detail=f"Requires role: {role}")
        return current_user
    return _check
