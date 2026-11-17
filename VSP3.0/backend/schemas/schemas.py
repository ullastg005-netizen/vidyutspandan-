from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    email: str
    full_name: str
    role: str
    employee_id: Optional[str] = None
    phone: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str
    is_active: bool
    created_at: str

class StreetlightCreate(BaseModel):
    name: str
    locality: str
    ward_id: str
    lamp_type: str = "LED"
    wattage: int = 45
    pole_type: str = "GI Pipe"
    latitude: float
    longitude: float
    status: str = "working"

class TransformerCreate(BaseModel):
    name: str
    locality: str
    ward_id: str
    capacity_kva: int
    voltage_ratio: str = "11kV/415V"
    make: str
    serial_number: Optional[str] = None
    latitude: float
    longitude: float
    status: str = "working"

class WorkOrderCreate(BaseModel):
    title: str
    fault_description: str
    location_address: str
    priority: str = "medium"
    asset_id: Optional[str] = None
    asset_type: Optional[str] = None
    assigned_worker_id: Optional[str] = None
    due_date: Optional[str] = None

class WorkOrderUpdateStatus(BaseModel):
    status: str
    notes: Optional[str] = None

class PublicRequestCreate(BaseModel):
    requester_name: str
    requester_phone: str
    requester_email: Optional[str] = None
    issue_type: str
    description: str
    location_address: str
    ward_id: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class PublicRequestResponse(BaseModel):
    tracking_id: str
    status: str
    message: str

class AuditLogCreate(BaseModel):
    action: str
    entity_type: str
    entity_id: str
    details: Optional[str] = None
