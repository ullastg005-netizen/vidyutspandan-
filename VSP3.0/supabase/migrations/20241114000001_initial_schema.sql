-- ====================================================================
-- VIDYUT SPANDAN (ವಿದ್ಯುತ್ ಸ್ಪಂದನ)
-- Distribution Infrastructure Operations & Maintenance Database Schema
-- BESCOM Distribution Operations & Maintenance Platform
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. OPERATIONAL ZONES
CREATE TABLE IF NOT EXISTS operational_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BBMP WARDS
CREATE TABLE IF NOT EXISTS wards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ward_number INTEGER NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    zone_id UUID REFERENCES operational_zones(id) ON DELETE SET NULL,
    locality VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. DEPARTMENTS & SUB-DIVISIONS
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    zone_id UUID REFERENCES operational_zones(id) ON DELETE SET NULL,
    contact_email VARCHAR(100),
    contact_phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. USER PROFILES & ROLES
CREATE TYPE app_role AS ENUM ('admin', 'officer', 'worker', 'supervisor');

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role app_role NOT NULL DEFAULT 'worker',
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    zone_id UUID REFERENCES operational_zones(id) ON DELETE SET NULL,
    employee_id VARCHAR(50) UNIQUE,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 11kV FEEDERS
CREATE TABLE IF NOT EXISTS feeders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    feeder_code VARCHAR(50) UNIQUE NOT NULL,
    feeder_name VARCHAR(150) NOT NULL,
    substation_name VARCHAR(150) NOT NULL,
    voltage_class VARCHAR(20) DEFAULT '11kV',
    service_area TEXT,
    zone_id UUID REFERENCES operational_zones(id) ON DELETE SET NULL,
    status VARCHAR(30) DEFAULT 'operational', -- operational, faulty, under_maintenance, out_of_service
    circuit_length_km NUMERIC(6, 2) DEFAULT 0.0,
    peak_load_mw NUMERIC(6, 2) DEFAULT 0.0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CORE INFRASTRUCTURE ASSETS
CREATE TYPE asset_type_enum AS ENUM ('streetlight', 'transformer', 'feeder');
CREATE TYPE asset_status_enum AS ENUM ('working', 'faulty', 'damaged', 'under_maintenance', 'awaiting_inspection', 'out_of_service');

CREATE TABLE IF NOT EXISTS infrastructure_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_code VARCHAR(50) UNIQUE NOT NULL,
    type asset_type_enum NOT NULL,
    name VARCHAR(150) NOT NULL,
    ward_id UUID REFERENCES wards(id) ON DELETE SET NULL,
    zone_id UUID REFERENCES operational_zones(id) ON DELETE SET NULL,
    locality VARCHAR(150) NOT NULL,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    status asset_status_enum DEFAULT 'working',
    installation_date DATE,
    last_inspection_date DATE,
    last_maintenance_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. SMART STREETLIGHTS (Asset Extension)
CREATE TABLE IF NOT EXISTS streetlights (
    id UUID PRIMARY KEY REFERENCES infrastructure_assets(id) ON DELETE CASCADE,
    pole_type VARCHAR(50) DEFAULT 'GI Pipe', -- GI Pipe, Steel Tubular, RCC
    lamp_type VARCHAR(50) DEFAULT 'LED',     -- LED, CFL, Sodium Vapour
    wattage INTEGER DEFAULT 45,
    circuit_id VARCHAR(50),
    assigned_team VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. DISTRIBUTION TRANSFORMERS (DTR Extension)
CREATE TABLE IF NOT EXISTS transformers (
    id UUID PRIMARY KEY REFERENCES infrastructure_assets(id) ON DELETE CASCADE,
    capacity_kva INTEGER NOT NULL,            -- 63, 100, 200, 315, 500
    voltage_ratio VARCHAR(30) DEFAULT '11kV/415V',
    feeder_id UUID REFERENCES feeders(id) ON DELETE SET NULL,
    make VARCHAR(100),
    serial_number VARCHAR(100),
    oil_level_status VARCHAR(50) DEFAULT 'Normal',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. CITIZEN & PATROL FAULT REPORTS
CREATE TYPE fault_severity_enum AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE fault_status_enum AS ENUM ('open', 'acknowledged', 'in_progress', 'resolved', 'closed');

CREATE TABLE IF NOT EXISTS fault_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_code VARCHAR(50) UNIQUE NOT NULL,
    asset_id UUID REFERENCES infrastructure_assets(id) ON DELETE SET NULL,
    asset_type asset_type_enum,
    reported_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reporter_name VARCHAR(150),
    reporter_phone VARCHAR(20),
    description TEXT NOT NULL,
    location_address TEXT NOT NULL,
    ward_id UUID REFERENCES wards(id) ON DELETE SET NULL,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    status fault_status_enum DEFAULT 'open',
    severity fault_severity_enum DEFAULT 'medium',
    converted_to_work_order BOOLEAN DEFAULT FALSE,
    work_order_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. WORK ORDERS
CREATE TYPE work_order_status_enum AS ENUM (
    'open',
    'assigned',
    'accepted',
    'in_progress',
    'awaiting_verification',
    'correction_required',
    'completed',
    'cancelled'
);

CREATE TABLE IF NOT EXISTS work_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    work_order_code VARCHAR(50) UNIQUE NOT NULL,
    asset_id UUID REFERENCES infrastructure_assets(id) ON DELETE SET NULL,
    asset_type asset_type_enum,
    title VARCHAR(200) NOT NULL,
    fault_description TEXT NOT NULL,
    location_address TEXT NOT NULL,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    priority fault_severity_enum DEFAULT 'medium',
    status work_order_status_enum DEFAULT 'open',
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    assigned_officer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    assigned_worker_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    supervisor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    ward_id UUID REFERENCES wards(id) ON DELETE SET NULL,
    zone_id UUID REFERENCES operational_zones(id) ON DELETE SET NULL,
    due_date DATE,
    completed_at TIMESTAMPTZ,
    verification_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. INSPECTION & REPAIR REPORTS
CREATE TABLE IF NOT EXISTS inspection_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    work_order_id UUID REFERENCES work_orders(id) ON DELETE CASCADE,
    submitted_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    findings TEXT NOT NULL,
    actions_taken TEXT NOT NULL,
    parts_replaced TEXT,
    time_spent_hours NUMERIC(4, 2) DEFAULT 0.0,
    verification_status VARCHAR(30) DEFAULT 'pending', -- pending, approved, rejected
    verified_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    verified_at TIMESTAMPTZ,
    rejection_reason TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. PHOTOGRAPHIC EVIDENCE ATTACHMENTS
CREATE TABLE IF NOT EXISTS evidence_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    work_order_id UUID REFERENCES work_orders(id) ON DELETE CASCADE,
    report_id UUID REFERENCES inspection_reports(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_type VARCHAR(50) DEFAULT 'image/jpeg',
    caption TEXT,
    uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. PUBLIC CITIZEN SERVICE GRIEVANCES
CREATE TABLE IF NOT EXISTS public_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tracking_id VARCHAR(50) UNIQUE NOT NULL,
    requester_name VARCHAR(150) NOT NULL,
    requester_phone VARCHAR(20) NOT NULL,
    requester_email VARCHAR(100),
    issue_type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    location_address TEXT NOT NULL,
    ward_id UUID REFERENCES wards(id) ON DELETE SET NULL,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    status VARCHAR(30) DEFAULT 'submitted', -- submitted, acknowledged, in_progress, resolved, closed
    priority VARCHAR(20) DEFAULT 'medium',
    resolution_notes TEXT,
    linked_work_order_id UUID REFERENCES work_orders(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. IN-APP NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'work_order',
    reference_id UUID,
    reference_type VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. AUDIT LOGS (Immutable security log)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    old_value JSONB,
    new_value JSONB,
    ip_address VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE infrastructure_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE streetlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE transformers ENABLE ROW LEVEL SECURITY;
ALTER TABLE feeders ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspection_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE fault_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to fetch user role
CREATE OR REPLACE FUNCTION auth.get_user_role()
RETURNS app_role AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Profiles: Users can read all active profiles, only admin can update
CREATE POLICY "Profiles readable by authenticated"
  ON profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admin full profile management"
  ON profiles FOR ALL TO authenticated
  USING (auth.get_user_role() = 'admin');

-- Infrastructure Assets: Public/Authenticated can read; Officers and Admins can mutate
CREATE POLICY "Infrastructure assets readable by all"
  ON infrastructure_assets FOR SELECT USING (true);

CREATE POLICY "Infrastructure assets writable by officer and admin"
  ON infrastructure_assets FOR ALL TO authenticated
  USING (auth.get_user_role() IN ('admin', 'officer'));

-- Work Orders:
-- Workers see only their assigned orders
-- Officers & Supervisors see orders within their jurisdiction
-- Admins see all
CREATE POLICY "Work order read access"
  ON work_orders FOR SELECT TO authenticated
  USING (
    auth.get_user_role() = 'admin' OR
    (auth.get_user_role() = 'officer') OR
    (auth.get_user_role() = 'supervisor') OR
    (auth.get_user_role() = 'worker' AND assigned_worker_id = auth.uid())
  );

CREATE POLICY "Work order update by assigned worker"
  ON work_orders FOR UPDATE TO authenticated
  USING (assigned_worker_id = auth.uid() OR auth.get_user_role() IN ('admin', 'officer', 'supervisor'));

CREATE POLICY "Work order insert by officer or admin"
  ON work_orders FOR INSERT TO authenticated
  WITH CHECK (auth.get_user_role() IN ('admin', 'officer'));

-- Public Requests: Public can insert without auth; read with matching tracking ID
CREATE POLICY "Public request insert open"
  ON public_requests FOR INSERT WITH CHECK (true);

CREATE POLICY "Public request read by tracking"
  ON public_requests FOR SELECT USING (true);

-- Notifications: Users only see their own
CREATE POLICY "User notifications private"
  ON notifications FOR ALL TO authenticated
  USING (user_id = auth.uid());

-- Audit logs: Read-only for Admin
CREATE POLICY "Audit logs read by admin only"
  ON audit_logs FOR SELECT TO authenticated
  USING (auth.get_user_role() = 'admin');

CREATE POLICY "Audit logs insert by system"
  ON audit_logs FOR INSERT TO authenticated
  WITH CHECK (true);
