from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel

try:
    from core.security import create_access_token, get_current_user
except ImportError:
    try:
        from api.core.security import create_access_token, get_current_user
    except ImportError:
        from app.core.security import create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

class LoginRequest(BaseModel):
    email: str
    password: str

DEMO_ACCOUNTS = {
    "admin@vidyutspandan.gov.in": {"password": "Admin@1234", "role": "admin", "name": "Rajesh Kumar Sharma"},
    "officer@vidyutspandan.gov.in": {"password": "Officer@1234", "role": "officer", "name": "Priya Venkatesh"},
    "worker@vidyutspandan.gov.in": {"password": "Worker@1234", "role": "worker", "name": "Suresh Babu"},
    "supervisor@vidyutspandan.gov.in": {"password": "Supervisor@1234", "role": "supervisor", "name": "Anitha Krishnamurthy"},
}

@router.post("/login")
async def login(credentials: LoginRequest):
    user = DEMO_ACCOUNTS.get(credentials.email.lower())
    if not user or user["password"] != credentials.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid official email or password."
        )
    
    token = create_access_token(
        data={"sub": credentials.email, "role": user["role"], "email": credentials.email}
    )
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "email": credentials.email,
            "full_name": user["name"],
            "role": user["role"]
        }
    }

@router.get("/me")
async def get_profile(current_user: dict = Depends(get_current_user)):
    return current_user
