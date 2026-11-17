from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional

try:
    from core.security import get_current_user, check_role
    from schemas.schemas import StreetlightCreate, TransformerCreate
except ImportError:
    try:
        from api.core.security import get_current_user, check_role
        from api.schemas.schemas import StreetlightCreate, TransformerCreate
    except ImportError:
        from app.core.security import get_current_user, check_role
        from app.schemas.schemas import StreetlightCreate, TransformerCreate

router = APIRouter(prefix="/assets", tags=["Infrastructure Assets"])

# In-memory prototype store mirroring database
STREETLIGHTS_DB = [
    {
        "id": "sl-001", "asset_code": "SL-JYN-001", "type": "streetlight",
        "name": "Jayanagar 4th Block - Pole 1", "locality": "Jayanagar 4th Block",
        "latitude": 12.9279, "longitude": 77.5833, "status": "working",
        "lamp_type": "LED", "wattage": 45, "pole_type": "GI Pipe"
    },
    {
        "id": "sl-002", "asset_code": "SL-JYN-002", "type": "streetlight",
        "name": "Jayanagar 4th Block - Pole 2", "locality": "Jayanagar 4th Block",
        "latitude": 12.9282, "longitude": 77.5837, "status": "faulty",
        "lamp_type": "LED", "wattage": 45, "pole_type": "GI Pipe"
    }
]

TRANSFORMERS_DB = [
    {
        "id": "tr-001", "asset_code": "DTR-JYN-001", "type": "transformer",
        "name": "Jayanagar DTR-1", "locality": "Jayanagar 4th Block",
        "latitude": 12.9270, "longitude": 77.5820, "status": "working",
        "capacity_kva": 100, "voltage_ratio": "11kV/415V", "make": "BHEL"
    }
]

@router.get("/streetlights")
async def list_streetlights(
    status: Optional[str] = None,
    ward_id: Optional[str] = None,
):
    results = STREETLIGHTS_DB
    if status and status != "all":
        results = [s for s in results if s["status"] == status]
    return {"data": results, "total": len(results)}

@router.post("/streetlights", dependencies=[Depends(check_role(["admin", "officer"]))])
async def create_streetlight(payload: StreetlightCreate):
    new_asset = {
        "id": f"sl-{len(STREETLIGHTS_DB) + 1}",
        "asset_code": f"SL-BLR-{len(STREETLIGHTS_DB) + 100}",
        "type": "streetlight",
        **payload.model_dump()
    }
    STREETLIGHTS_DB.append(new_asset)
    return {"message": "Streetlight registered successfully", "data": new_asset}

@router.get("/transformers")
async def list_transformers(status: Optional[str] = None):
    results = TRANSFORMERS_DB
    if status and status != "all":
        results = [t for t in results if t["status"] == status]
    return {"data": results, "total": len(results)}

@router.post("/transformers", dependencies=[Depends(check_role(["admin", "officer"]))])
async def create_transformer(payload: TransformerCreate):
    new_asset = {
        "id": f"tr-{len(TRANSFORMERS_DB) + 1}",
        "asset_code": f"DTR-BLR-{len(TRANSFORMERS_DB) + 100}",
        "type": "transformer",
        **payload.model_dump()
    }
    TRANSFORMERS_DB.append(new_asset)
    return {"message": "Transformer registered successfully", "data": new_asset}
