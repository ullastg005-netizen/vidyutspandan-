from fastapi import APIRouter, Depends

try:
    from core.security import get_current_user
except ImportError:
    try:
        from api.core.security import get_current_user
    except ImportError:
        from app.core.security import get_current_user

router = APIRouter(prefix="/reports", tags=["Analytics & Reports"])

@router.get("/summary")
async def get_analytics_summary(current_user: dict = Depends(get_current_user)):
    return {
        "total_assets": 487,
        "total_streetlights": 324,
        "working_streetlights": 289,
        "faulty_streetlights": 23,
        "maintenance_streetlights": 12,
        "total_transformers": 98,
        "total_feeders": 24,
        "open_work_orders": 18,
        "assigned_work_orders": 32,
        "pending_verification": 7,
        "completed_work_orders": 156,
        "uptime_percentage": 94.8,
        "mttr_hours": 3.4
    }
