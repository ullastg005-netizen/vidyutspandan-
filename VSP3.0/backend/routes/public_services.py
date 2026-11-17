from fastapi import APIRouter, HTTPException
import random
from datetime import datetime, timezone

try:
    from schemas.schemas import PublicRequestCreate, PublicRequestResponse
except ImportError:
    try:
        from api.schemas.schemas import PublicRequestCreate, PublicRequestResponse
    except ImportError:
        from app.schemas.schemas import PublicRequestCreate, PublicRequestResponse

router = APIRouter(prefix="/public", tags=["Public Citizen Services"])

PUBLIC_COMPLAINTS_DB = {
    "VS2024110001": {
        "tracking_id": "VS2024110001",
        "requester_name": "Ramesh Nair",
        "requester_phone": "9876500001",
        "issue_type": "streetlight_fault",
        "description": "Street light near our apartment not working since last week.",
        "location_address": "No. 15, 4th Cross, Jayanagar 3rd Block",
        "status": "in_progress",
        "resolution_notes": None,
        "created_at": "2024-11-05T18:30:00Z"
    },
    "VS2024110002": {
        "tracking_id": "VS2024110002",
        "requester_name": "Sunita Rao",
        "requester_phone": "9876500002",
        "issue_type": "infrastructure_damage",
        "description": "Electric pole looks unstable after recent rains.",
        "location_address": "BTM 1st Stage, 100 Feet Road",
        "status": "acknowledged",
        "resolution_notes": None,
        "created_at": "2024-11-06T10:00:00Z"
    }
}

@router.post("/complaint", response_model=PublicRequestResponse)
async def submit_public_complaint(payload: PublicRequestCreate):
    tracking_id = f"VS2024{random.randint(100000, 999999)}"
    record = {
        "tracking_id": tracking_id,
        **payload.model_dump(),
        "status": "submitted",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    PUBLIC_COMPLAINTS_DB[tracking_id] = record
    return {
        "tracking_id": tracking_id,
        "status": "submitted",
        "message": "Complaint registered successfully. Your Sub-Division Officer will review shortly."
    }

@router.get("/track/{tracking_id}")
async def track_complaint(tracking_id: str):
    complaint = PUBLIC_COMPLAINTS_DB.get(tracking_id.strip().upper())
    if not complaint:
        raise HTTPException(
            status_code=404,
            detail="No grievance found matching this tracking reference ID."
        )
    return {"data": complaint}
