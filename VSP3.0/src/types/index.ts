// Core application types for Vidyut Spandan

export type UserRole = 'admin' | 'officer' | 'worker' | 'supervisor';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  department_id?: string;
  zone_id?: string;
  is_active: boolean;
  created_at: string;
  avatar_url?: string;
  phone?: string;
  employee_id?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  zone_id?: string;
  head_officer_id?: string;
  contact_email?: string;
  contact_phone?: string;
  is_active: boolean;
  created_at: string;
}

export interface Zone {
  id: string;
  name: string;
  code: string;
  description?: string;
  created_at: string;
}

export interface Ward {
  id: string;
  name: string;
  ward_number: number;
  zone_id: string;
  zone?: Zone;
  locality: string;
  created_at: string;
}

export type InfrastructureType = 'streetlight' | 'transformer' | 'feeder';
export type InfrastructureStatus = 'working' | 'faulty' | 'damaged' | 'under_maintenance' | 'awaiting_inspection' | 'out_of_service';

export interface InfrastructureAsset {
  id: string;
  asset_code: string;
  type: InfrastructureType;
  name: string;
  ward_id: string;
  ward?: Ward;
  zone_id: string;
  zone?: Zone;
  locality: string;
  latitude: number;
  longitude: number;
  status: InfrastructureStatus;
  installation_date?: string;
  last_inspection_date?: string;
  last_maintenance_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Streetlight extends InfrastructureAsset {
  pole_type?: string;
  lamp_type?: string;
  wattage?: number;
  circuit_id?: string;
  assigned_team_id?: string;
}

export interface Transformer extends InfrastructureAsset {
  capacity_kva: number;
  voltage_ratio?: string;
  feeder_id?: string;
  make?: string;
  serial_number?: string;
  oil_level_status?: string;
}

export interface Feeder {
  id: string;
  feeder_code: string;
  feeder_name: string;
  substation_name?: string;
  voltage_class: string;
  service_area?: string;
  zone_id: string;
  zone?: Zone;
  status: 'operational' | 'faulty' | 'under_maintenance' | 'out_of_service';
  circuit_length_km?: number;
  peak_load_mw?: number;
  created_at: string;
  updated_at: string;
}

export type WorkOrderStatus =
  | 'open'
  | 'assigned'
  | 'accepted'
  | 'in_progress'
  | 'awaiting_verification'
  | 'correction_required'
  | 'completed'
  | 'cancelled';

export type WorkOrderPriority = 'low' | 'medium' | 'high' | 'critical';

export interface WorkOrder {
  id: string;
  work_order_code: string;
  asset_id?: string;
  asset?: InfrastructureAsset;
  asset_type?: InfrastructureType;
  title: string;
  fault_description: string;
  location_address: string;
  latitude?: number;
  longitude?: number;
  priority: WorkOrderPriority;
  status: WorkOrderStatus;
  created_by: string;
  created_by_user?: User;
  assigned_officer_id?: string;
  assigned_officer?: User;
  assigned_worker_id?: string;
  assigned_worker?: User;
  supervisor_id?: string;
  supervisor?: User;
  due_date?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  verification_notes?: string;
  ward_id?: string;
  ward?: Ward;
  zone_id?: string;
  zone?: Zone;
}

export interface InspectionReport {
  id: string;
  work_order_id: string;
  submitted_by: string;
  submitted_by_user?: User;
  findings: string;
  actions_taken: string;
  parts_replaced?: string;
  time_spent_hours?: number;
  submitted_at: string;
  verification_status: 'pending' | 'approved' | 'rejected';
  verified_by?: string;
  verified_at?: string;
  rejection_reason?: string;
}

export interface EvidenceAttachment {
  id: string;
  work_order_id: string;
  report_id?: string;
  file_name: string;
  file_url: string;
  file_type: string;
  uploaded_by: string;
  uploaded_at: string;
  caption?: string;
}

export interface FaultReport {
  id: string;
  report_code: string;
  asset_id?: string;
  asset?: InfrastructureAsset;
  asset_type?: InfrastructureType;
  reported_by?: string;
  reporter_name?: string;
  reporter_phone?: string;
  description: string;
  location_address: string;
  latitude?: number;
  longitude?: number;
  ward_id?: string;
  status: 'open' | 'acknowledged' | 'in_progress' | 'resolved' | 'closed';
  severity: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
  updated_at: string;
  converted_to_work_order?: boolean;
  work_order_id?: string;
}

export interface PublicRequest {
  id: string;
  tracking_id: string;
  requester_name: string;
  requester_phone: string;
  requester_email?: string;
  issue_type: 'streetlight_fault' | 'infrastructure_damage' | 'power_outage' | 'other';
  description: string;
  location_address: string;
  ward_id?: string;
  latitude?: number;
  longitude?: number;
  status: 'submitted' | 'acknowledged' | 'in_progress' | 'resolved' | 'closed';
  priority?: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
  resolution_notes?: string;
  linked_work_order_id?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'work_order' | 'assignment' | 'verification' | 'public_request' | 'system';
  reference_id?: string;
  reference_type?: string;
  is_read: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  user?: User;
  action: string;
  entity_type: string;
  entity_id: string;
  old_value?: Record<string, unknown>;
  new_value?: Record<string, unknown>;
  ip_address?: string;
  created_at: string;
}

export interface DashboardStats {
  total_assets: number;
  total_streetlights: number;
  working_streetlights: number;
  faulty_streetlights: number;
  maintenance_streetlights: number;
  total_transformers: number;
  total_feeders: number;
  open_work_orders: number;
  assigned_work_orders: number;
  pending_verification: number;
  completed_work_orders: number;
  open_public_requests: number;
  total_users: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}
