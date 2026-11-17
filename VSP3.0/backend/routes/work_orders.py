from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from datetime import datetime, timezone

try:
    from core.security import get_current_user, check_role
    from schemas.schemas import WorkOrderCreate, WorkOrderUpdateStatus
except ImportError:
    try:
        from api.core.security import get_current_user, check_role
        from api.schemas.schemas import WorkOrderCreate, WorkOrderUpdateStatus
    except ImportError:
        from app.core.security import get_current_user, check_role
        from app.schemas.schemas import WorkOrderCreate, WorkOrderUpdateStatus

router = APIRouter(prefix="/work-orders", tags=["Work Order Lifecycle"])

WORK_ORDERS_DB = [
    {
        "id": "wo-001",
        "work_order_code": "WO-2024-0001",
        "title": "Faulty streetlight - Jayanagar 4th Block Pole 2",
        "fault_description": "LED lamp not working, ballast needs replacement",
        "location_address": "Jayanagar 4th Block, Near Post Office",
        "priority": "high",
        "status": "in_progress",
        "assigned_worker_id": "worker-001",
        "due_date": "2024-11-20",
        "created_at": "2024-11-10T09:00:00Z"
    },
    {
        "id": "wo-002",
        "work_order_code": "WO-2024-0002",
        "title": "Transformer fault - Koramangala DTR-1",
        "fault_description": "Oil leakage detected, humming noise observed",
        "location_address": "Koramangala 6th Block, Behind Forum Mall",
        "priority": "critical",
        "status": "assigned",
        "assigned_worker_id": "worker-001",
        "due_date": "2024-11-15",
        "created_at": "2024-11-11T10:30:00Z"
    }
]

@router.get("")
async def list_work_orders(
    current_user: dict = Depends(get_current_user),
    status: Optional[str] = None
):
    role = current_user.get("role")
    results = WORK_ORDERS_DB
    
    # Linemen only see their own assigned work
    if role == "worker":
        results = [w for w in results if w.get("assigned_worker_id") == current_user.get("id")]
    
    if status and status != "all":
        results = [w for w in results if w["status"] == status]
        
    return {"data": results, "total": len(results)}

@router.post("", dependencies=[Depends(check_role(["admin", "officer"]))])
async def create_work_order(
    payload: WorkOrderCreate,
    current_user: dict = Depends(get_current_user)
):
    new_order = {
        "id": f"wo-{len(WORK_ORDERS_DB) + 1:03d}",
        "work_order_code": f"WO-2024-{len(WORK_ORDERS_DB) + 1:04d}",
        **payload.model_dump(),
        "status": "assigned" if payload.assigned_worker_id else "open",
        "created_by": current_user.get("id"),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    WORK_ORDERS_DB.append(new_order)
    return {"message": "Work Order created and dispatched", "data": new_order}

@router.patch("/{order_id}/status")
async def update_work_order_status(
    order_id: str,
    payload: WorkOrderUpdateStatus,
    current_user: dict = Depends(get_current_user)
):
    for order in WORK_ORDERS_DB:
        if order["id"] == order_id:
            order["status"] = payload.status
            return {"message": f"Status updated to {payload.status}", "data": order}
            
    raise HTTPException(status_code=404, detail="Work Order not found")
