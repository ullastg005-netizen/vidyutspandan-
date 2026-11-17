// Demonstration data for Vidyut Spandan prototype
// All data marked as SAMPLE DATA — not actual BESCOM infrastructure records

import type {
  Ward, Zone, InfrastructureAsset, Streetlight, Transformer,
  Feeder, WorkOrder, FaultReport, PublicRequest, DashboardStats
} from '../types';

export const DEMO_ZONES: Zone[] = [
  { id: 'zone-001', name: 'South Zone', code: 'SZ', description: 'Covers South Bengaluru wards', created_at: '2024-01-01T00:00:00Z' },
  { id: 'zone-002', name: 'North Zone', code: 'NZ', description: 'Covers North Bengaluru wards', created_at: '2024-01-01T00:00:00Z' },
  { id: 'zone-003', name: 'East Zone', code: 'EZ', description: 'Covers East Bengaluru wards', created_at: '2024-01-01T00:00:00Z' },
  { id: 'zone-004', name: 'West Zone', code: 'WZ', description: 'Covers West Bengaluru wards', created_at: '2024-01-01T00:00:00Z' },
];

export const DEMO_WARDS: Ward[] = [
  { id: 'ward-001', name: 'Jayanagar', ward_number: 174, zone_id: 'zone-001', locality: 'Jayanagar', created_at: '2024-01-01T00:00:00Z' },
  { id: 'ward-002', name: 'BTM Layout', ward_number: 177, zone_id: 'zone-001', locality: 'BTM Layout', created_at: '2024-01-01T00:00:00Z' },
  { id: 'ward-003', name: 'Koramangala', ward_number: 151, zone_id: 'zone-001', locality: 'Koramangala', created_at: '2024-01-01T00:00:00Z' },
  { id: 'ward-004', name: 'Indiranagar', ward_number: 81, zone_id: 'zone-003', locality: 'Indiranagar', created_at: '2024-01-01T00:00:00Z' },
  { id: 'ward-005', name: 'Whitefield', ward_number: 56, zone_id: 'zone-003', locality: 'Whitefield', created_at: '2024-01-01T00:00:00Z' },
  { id: 'ward-006', name: 'Rajajinagar', ward_number: 125, zone_id: 'zone-004', locality: 'Rajajinagar', created_at: '2024-01-01T00:00:00Z' },
  { id: 'ward-007', name: 'Malleswaram', ward_number: 94, zone_id: 'zone-002', locality: 'Malleswaram', created_at: '2024-01-01T00:00:00Z' },
  { id: 'ward-008', name: 'Hebbal', ward_number: 6, zone_id: 'zone-002', locality: 'Hebbal', created_at: '2024-01-01T00:00:00Z' },
];

export const DEMO_STREETLIGHTS: Streetlight[] = [
  {
    id: 'sl-001', asset_code: 'SL-JYN-001', type: 'streetlight', name: 'Jayanagar 4th Block - Pole 1',
    ward_id: 'ward-001', zone_id: 'zone-001', locality: 'Jayanagar 4th Block',
    latitude: 12.9279, longitude: 77.5833, status: 'working',
    installation_date: '2022-03-15', last_inspection_date: '2024-10-01',
    lamp_type: 'LED', wattage: 45, pole_type: 'GI Pipe',
    created_at: '2022-03-15T00:00:00Z', updated_at: '2024-10-01T00:00:00Z',
  },
  {
    id: 'sl-002', asset_code: 'SL-JYN-002', type: 'streetlight', name: 'Jayanagar 4th Block - Pole 2',
    ward_id: 'ward-001', zone_id: 'zone-001', locality: 'Jayanagar 4th Block',
    latitude: 12.9282, longitude: 77.5837, status: 'faulty',
    installation_date: '2022-03-15', last_inspection_date: '2024-09-15',
    lamp_type: 'LED', wattage: 45, pole_type: 'GI Pipe',
    created_at: '2022-03-15T00:00:00Z', updated_at: '2024-10-15T00:00:00Z',
  },
  {
    id: 'sl-003', asset_code: 'SL-BTM-001', type: 'streetlight', name: 'BTM 2nd Stage Main Road - P1',
    ward_id: 'ward-002', zone_id: 'zone-001', locality: 'BTM 2nd Stage',
    latitude: 12.9166, longitude: 77.6101, status: 'working',
    installation_date: '2021-07-20', last_inspection_date: '2024-09-20',
    lamp_type: 'LED', wattage: 60, pole_type: 'Steel Tubular',
    created_at: '2021-07-20T00:00:00Z', updated_at: '2024-09-20T00:00:00Z',
  },
  {
    id: 'sl-004', asset_code: 'SL-KOR-001', type: 'streetlight', name: 'Koramangala 5th Block - P1',
    ward_id: 'ward-003', zone_id: 'zone-001', locality: 'Koramangala 5th Block',
    latitude: 12.9345, longitude: 77.6193, status: 'under_maintenance',
    installation_date: '2020-11-10', last_inspection_date: '2024-10-05',
    lamp_type: 'CFL', wattage: 70, pole_type: 'RCC',
    created_at: '2020-11-10T00:00:00Z', updated_at: '2024-10-05T00:00:00Z',
  },
  {
    id: 'sl-005', asset_code: 'SL-IND-001', type: 'streetlight', name: 'Indiranagar 100 Feet Road - P1',
    ward_id: 'ward-004', zone_id: 'zone-003', locality: 'Indiranagar',
    latitude: 12.9784, longitude: 77.6408, status: 'working',
    installation_date: '2023-01-05', last_inspection_date: '2024-09-25',
    lamp_type: 'LED', wattage: 55, pole_type: 'Steel Tubular',
    created_at: '2023-01-05T00:00:00Z', updated_at: '2024-09-25T00:00:00Z',
  },
  {
    id: 'sl-006', asset_code: 'SL-WHF-001', type: 'streetlight', name: 'Whitefield Main Road - P1',
    ward_id: 'ward-005', zone_id: 'zone-003', locality: 'Whitefield',
    latitude: 12.9698, longitude: 77.7500, status: 'damaged',
    installation_date: '2021-05-15', last_inspection_date: '2024-08-30',
    lamp_type: 'Sodium Vapour', wattage: 100, pole_type: 'GI Pipe',
    created_at: '2021-05-15T00:00:00Z', updated_at: '2024-08-30T00:00:00Z',
  },
  {
    id: 'sl-007', asset_code: 'SL-MAL-001', type: 'streetlight', name: 'Malleswaram 8th Cross - P1',
    ward_id: 'ward-007', zone_id: 'zone-002', locality: 'Malleswaram',
    latitude: 13.0075, longitude: 77.5674, status: 'working',
    installation_date: '2022-09-10', last_inspection_date: '2024-10-10',
    lamp_type: 'LED', wattage: 45, pole_type: 'GI Pipe',
    created_at: '2022-09-10T00:00:00Z', updated_at: '2024-10-10T00:00:00Z',
  },
  {
    id: 'sl-008', asset_code: 'SL-HBL-001', type: 'streetlight', name: 'Hebbal Flyover Road - P1',
    ward_id: 'ward-008', zone_id: 'zone-002', locality: 'Hebbal',
    latitude: 13.0351, longitude: 77.5950, status: 'awaiting_inspection',
    installation_date: '2023-06-01', last_inspection_date: '2024-07-15',
    lamp_type: 'LED', wattage: 60, pole_type: 'Steel Tubular',
    created_at: '2023-06-01T00:00:00Z', updated_at: '2024-07-15T00:00:00Z',
  },
];

export const DEMO_TRANSFORMERS: Transformer[] = [
  {
    id: 'tr-001', asset_code: 'DTR-JYN-001', type: 'transformer',
    name: 'Jayanagar DTR-1', ward_id: 'ward-001', zone_id: 'zone-001',
    locality: 'Jayanagar 4th Block', latitude: 12.9270, longitude: 77.5820,
    status: 'working', capacity_kva: 100, voltage_ratio: '11kV/415V',
    feeder_id: 'fdr-001', make: 'BHEL', serial_number: 'BHEL-2019-0421',
    installation_date: '2019-06-15', last_inspection_date: '2024-09-01',
    created_at: '2019-06-15T00:00:00Z', updated_at: '2024-09-01T00:00:00Z',
  },
  {
    id: 'tr-002', asset_code: 'DTR-KOR-001', type: 'transformer',
    name: 'Koramangala DTR-1', ward_id: 'ward-003', zone_id: 'zone-001',
    locality: 'Koramangala 6th Block', latitude: 12.9358, longitude: 77.6210,
    status: 'faulty', capacity_kva: 200, voltage_ratio: '11kV/415V',
    feeder_id: 'fdr-001', make: 'Kirloskar', serial_number: 'KKL-2021-1105',
    installation_date: '2021-03-20', last_inspection_date: '2024-10-02',
    created_at: '2021-03-20T00:00:00Z', updated_at: '2024-10-02T00:00:00Z',
  },
  {
    id: 'tr-003', asset_code: 'DTR-IND-001', type: 'transformer',
    name: 'Indiranagar DTR-1', ward_id: 'ward-004', zone_id: 'zone-003',
    locality: 'Indiranagar CMH Road', latitude: 12.9780, longitude: 77.6395,
    status: 'working', capacity_kva: 315, voltage_ratio: '11kV/415V',
    feeder_id: 'fdr-002', make: 'ABB', serial_number: 'ABB-2020-5678',
    installation_date: '2020-08-10', last_inspection_date: '2024-08-15',
    created_at: '2020-08-10T00:00:00Z', updated_at: '2024-08-15T00:00:00Z',
  },
  {
    id: 'tr-004', asset_code: 'DTR-WHF-001', type: 'transformer',
    name: 'Whitefield DTR-1', ward_id: 'ward-005', zone_id: 'zone-003',
    locality: 'Whitefield ITPL Road', latitude: 12.9710, longitude: 77.7515,
    status: 'under_maintenance', capacity_kva: 500, voltage_ratio: '11kV/415V',
    feeder_id: 'fdr-002', make: 'Siemens', serial_number: 'SIE-2022-9901',
    installation_date: '2022-01-15', last_inspection_date: '2024-10-08',
    created_at: '2022-01-15T00:00:00Z', updated_at: '2024-10-08T00:00:00Z',
  },
  {
    id: 'tr-005', asset_code: 'DTR-MAL-001', type: 'transformer',
    name: 'Malleswaram DTR-1', ward_id: 'ward-007', zone_id: 'zone-002',
    locality: 'Malleswaram Circle', latitude: 13.0068, longitude: 77.5660,
    status: 'working', capacity_kva: 100, voltage_ratio: '11kV/415V',
    feeder_id: 'fdr-003', make: 'BHEL', serial_number: 'BHEL-2018-0210',
    installation_date: '2018-11-20', last_inspection_date: '2024-07-20',
    created_at: '2018-11-20T00:00:00Z', updated_at: '2024-07-20T00:00:00Z',
  },
];

export const DEMO_FEEDERS: Feeder[] = [
  {
    id: 'fdr-001', feeder_code: 'FDR-SZ-001', feeder_name: 'South Zone Feeder 1',
    substation_name: 'Jayanagar 220kV Substation', voltage_class: '11kV',
    service_area: 'Jayanagar, BTM, Koramangala', zone_id: 'zone-001',
    status: 'operational', circuit_length_km: 8.5, peak_load_mw: 4.2,
    created_at: '2018-01-01T00:00:00Z', updated_at: '2024-10-01T00:00:00Z',
  },
  {
    id: 'fdr-002', feeder_code: 'FDR-EZ-001', feeder_name: 'East Zone Feeder 1',
    substation_name: 'Indiranagar 110kV Substation', voltage_class: '11kV',
    service_area: 'Indiranagar, Whitefield, HAL', zone_id: 'zone-003',
    status: 'operational', circuit_length_km: 12.3, peak_load_mw: 6.8,
    created_at: '2019-06-01T00:00:00Z', updated_at: '2024-09-15T00:00:00Z',
  },
  {
    id: 'fdr-003', feeder_code: 'FDR-NZ-001', feeder_name: 'North Zone Feeder 1',
    substation_name: 'Malleswaram 110kV Substation', voltage_class: '11kV',
    service_area: 'Malleswaram, Hebbal, Yeshwanthpur', zone_id: 'zone-002',
    status: 'faulty', circuit_length_km: 9.7, peak_load_mw: 3.9,
    created_at: '2017-03-01T00:00:00Z', updated_at: '2024-10-10T00:00:00Z',
  },
  {
    id: 'fdr-004', feeder_code: 'FDR-WZ-001', feeder_name: 'West Zone Feeder 1',
    substation_name: 'Rajajinagar 110kV Substation', voltage_class: '11kV',
    service_area: 'Rajajinagar, Vijayanagar, Basaveshwara Nagar', zone_id: 'zone-004',
    status: 'operational', circuit_length_km: 7.2, peak_load_mw: 3.1,
    created_at: '2020-08-01T00:00:00Z', updated_at: '2024-08-20T00:00:00Z',
  },
];

export const DEMO_WORK_ORDERS: WorkOrder[] = [
  {
    id: 'wo-001', work_order_code: 'WO-2024-0001',
    asset_id: 'sl-002', asset_type: 'streetlight',
    title: 'Faulty streetlight - Jayanagar 4th Block Pole 2',
    fault_description: 'LED lamp not working, ballast needs replacement',
    location_address: 'Jayanagar 4th Block, Near Post Office',
    priority: 'high', status: 'in_progress',
    created_by: 'officer-001', assigned_officer_id: 'officer-001',
    assigned_worker_id: 'worker-001', supervisor_id: 'supervisor-001',
    due_date: '2024-11-20', created_at: '2024-11-10T09:00:00Z',
    updated_at: '2024-11-12T14:00:00Z', ward_id: 'ward-001', zone_id: 'zone-001',
  },
  {
    id: 'wo-002', work_order_code: 'WO-2024-0002',
    asset_id: 'tr-002', asset_type: 'transformer',
    title: 'Transformer fault - Koramangala DTR-1',
    fault_description: 'Oil leakage detected, humming noise observed',
    location_address: 'Koramangala 6th Block, Behind Forum Mall',
    priority: 'critical', status: 'assigned',
    created_by: 'officer-001', assigned_officer_id: 'officer-001',
    assigned_worker_id: 'worker-001', supervisor_id: 'supervisor-001',
    due_date: '2024-11-15', created_at: '2024-11-11T10:30:00Z',
    updated_at: '2024-11-11T11:00:00Z', ward_id: 'ward-003', zone_id: 'zone-001',
  },
  {
    id: 'wo-003', work_order_code: 'WO-2024-0003',
    asset_id: 'sl-006', asset_type: 'streetlight',
    title: 'Damaged pole - Whitefield Main Road',
    fault_description: 'Pole bent due to vehicle collision, safety hazard',
    location_address: 'Whitefield Main Road, Near Hope Farm Junction',
    priority: 'critical', status: 'awaiting_verification',
    created_by: 'officer-001', assigned_officer_id: 'officer-001',
    assigned_worker_id: 'worker-001', supervisor_id: 'supervisor-001',
    due_date: '2024-11-13', created_at: '2024-11-08T08:00:00Z',
    updated_at: '2024-11-12T16:00:00Z', ward_id: 'ward-005', zone_id: 'zone-003',
  },
  {
    id: 'wo-004', work_order_code: 'WO-2024-0004',
    asset_id: 'sl-004', asset_type: 'streetlight',
    title: 'Scheduled maintenance - Koramangala 5th Block',
    fault_description: 'Annual preventive maintenance of streetlights',
    location_address: 'Koramangala 5th Block Main Road',
    priority: 'low', status: 'completed',
    created_by: 'officer-001', assigned_officer_id: 'officer-001',
    assigned_worker_id: 'worker-001', supervisor_id: 'supervisor-001',
    due_date: '2024-11-10', completed_at: '2024-11-09T15:00:00Z',
    created_at: '2024-11-05T09:00:00Z',
    updated_at: '2024-11-09T15:30:00Z', ward_id: 'ward-003', zone_id: 'zone-001',
  },
  {
    id: 'wo-005', work_order_code: 'WO-2024-0005',
    asset_id: 'tr-004', asset_type: 'transformer',
    title: 'Preventive maintenance - Whitefield DTR-1',
    fault_description: 'Scheduled oil testing and bushing inspection',
    location_address: 'Whitefield ITPL Road, Near Phoenix Mall',
    priority: 'medium', status: 'open',
    created_by: 'officer-001', assigned_officer_id: 'officer-001',
    due_date: '2024-11-25', created_at: '2024-11-13T10:00:00Z',
    updated_at: '2024-11-13T10:00:00Z', ward_id: 'ward-005', zone_id: 'zone-003',
  },
];

export const DEMO_FAULT_REPORTS: FaultReport[] = [
  {
    id: 'fr-001', report_code: 'FR-2024-0101',
    asset_id: 'sl-002', asset_type: 'streetlight',
    reporter_name: 'Citizen Report', reporter_phone: '9876543210',
    description: 'Streetlight not working since 3 days',
    location_address: 'Jayanagar 4th Block, Near Post Office',
    ward_id: 'ward-001', status: 'in_progress', severity: 'medium',
    created_at: '2024-11-08T20:00:00Z', updated_at: '2024-11-10T09:00:00Z',
    converted_to_work_order: true, work_order_id: 'wo-001',
  },
  {
    id: 'fr-002', report_code: 'FR-2024-0102',
    reporter_name: 'Resident', reporter_phone: '9123456789',
    description: 'Transformer making loud noise near residential area',
    location_address: 'Koramangala 6th Block',
    ward_id: 'ward-003', status: 'in_progress', severity: 'high',
    created_at: '2024-11-11T07:30:00Z', updated_at: '2024-11-11T10:30:00Z',
    converted_to_work_order: true, work_order_id: 'wo-002',
  },
  {
    id: 'fr-003', report_code: 'FR-2024-0103',
    reporter_name: 'Traffic Police', reporter_phone: '9988776655',
    description: 'Electricity pole fallen blocking traffic',
    location_address: 'Whitefield Main Road, Near Hope Farm',
    ward_id: 'ward-005', status: 'in_progress', severity: 'critical',
    created_at: '2024-11-08T06:00:00Z', updated_at: '2024-11-08T08:00:00Z',
    converted_to_work_order: true, work_order_id: 'wo-003',
  },
];

export const DEMO_PUBLIC_REQUESTS: PublicRequest[] = [
  {
    id: 'pr-001', tracking_id: 'VS2024110001',
    requester_name: 'Ramesh Nair', requester_phone: '9876500001',
    requester_email: 'ramesh@example.com',
    issue_type: 'streetlight_fault',
    description: 'Street light near our apartment not working since last week. Kids facing difficulty returning home at night.',
    location_address: 'No. 15, 4th Cross, Jayanagar 3rd Block',
    ward_id: 'ward-001', latitude: 12.9290, longitude: 77.5810,
    status: 'in_progress', priority: 'high',
    created_at: '2024-11-05T18:30:00Z', updated_at: '2024-11-10T09:00:00Z',
  },
  {
    id: 'pr-002', tracking_id: 'VS2024110002',
    requester_name: 'Sunita Rao', requester_phone: '9876500002',
    issue_type: 'infrastructure_damage',
    description: 'Electric pole looks unstable after recent rains. Leaning towards the road.',
    location_address: 'BTM 1st Stage, 100 Feet Road',
    ward_id: 'ward-002', status: 'acknowledged', priority: 'medium',
    created_at: '2024-11-06T10:00:00Z', updated_at: '2024-11-06T14:00:00Z',
  },
  {
    id: 'pr-003', tracking_id: 'VS2024110003',
    requester_name: 'Prakash Hegde', requester_phone: '9876500003',
    requester_email: 'prakash@example.com',
    issue_type: 'streetlight_fault',
    description: 'Multiple streetlights in our street are not working. Very dark at night.',
    location_address: 'Indiranagar 12th Main, 1st Cross',
    ward_id: 'ward-004', status: 'resolved', priority: 'high',
    created_at: '2024-11-01T09:00:00Z', updated_at: '2024-11-08T16:00:00Z',
    resolution_notes: 'Lamp replacements completed on 08/11/2024.',
  },
];

export const DEMO_DASHBOARD_STATS: DashboardStats = {
  total_assets: 487,
  total_streetlights: 324,
  working_streetlights: 289,
  faulty_streetlights: 23,
  maintenance_streetlights: 12,
  total_transformers: 98,
  total_feeders: 24,
  open_work_orders: 18,
  assigned_work_orders: 32,
  pending_verification: 7,
  completed_work_orders: 156,
  open_public_requests: 11,
  total_users: 48,
};

export const WARD_STATS = [
  { ward: 'Jayanagar', total: 45, working: 41, faulty: 3, maintenance: 1 },
  { ward: 'BTM Layout', total: 38, working: 34, faulty: 2, maintenance: 2 },
  { ward: 'Koramangala', total: 52, working: 45, faulty: 5, maintenance: 2 },
  { ward: 'Indiranagar', total: 41, working: 38, faulty: 2, maintenance: 1 },
  { ward: 'Whitefield', total: 48, working: 40, faulty: 6, maintenance: 2 },
  { ward: 'Rajajinagar', total: 35, working: 32, faulty: 2, maintenance: 1 },
  { ward: 'Malleswaram', total: 40, working: 36, faulty: 3, maintenance: 1 },
  { ward: 'Hebbal', total: 25, working: 23, faulty: 0, maintenance: 2 },
];

export const MONTHLY_FAULT_TRENDS = [
  { month: 'May', faults: 24, resolved: 22 },
  { month: 'Jun', faults: 31, resolved: 28 },
  { month: 'Jul', faults: 42, resolved: 38 },
  { month: 'Aug', faults: 38, resolved: 35 },
  { month: 'Sep', faults: 29, resolved: 27 },
  { month: 'Oct', faults: 35, resolved: 31 },
  { month: 'Nov', faults: 18, resolved: 14 },
];

export const WORK_ORDER_STATUS_DATA = [
  { status: 'Open', count: 18 },
  { status: 'Assigned', count: 32 },
  { status: 'In Progress', count: 15 },
  { status: 'Awaiting Verification', count: 7 },
  { status: 'Completed', count: 156 },
  { status: 'Cancelled', count: 4 },
];
