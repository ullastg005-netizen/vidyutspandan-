-- ====================================================================
-- VIDYUT SPANDAN (ವಿದ್ಯುತ್ ಸ್ಪಂದನ)
-- Demonstration Seed Data (SAMPLE DATA ONLY)
-- Bengaluru Distribution Operations Demonstration Data
-- ====================================================================

-- 1. ZONES
INSERT INTO operational_zones (id, name, code, description) VALUES
  ('a1b2c3d4-0001-0000-0000-000000000001', 'South Zone', 'SZ', 'Covers South Bengaluru circles: Jayanagar, BTM, Koramangala'),
  ('a1b2c3d4-0002-0000-0000-000000000002', 'North Zone', 'NZ', 'Covers North Bengaluru circles: Malleswaram, Hebbal, Yeshwanthpur'),
  ('a1b2c3d4-0003-0000-0000-000000000003', 'East Zone', 'EZ', 'Covers East Bengaluru circles: Indiranagar, Whitefield, HAL'),
  ('a1b2c3d4-0004-0000-0000-000000000004', 'West Zone', 'WZ', 'Covers West Bengaluru circles: Rajajinagar, Vijayanagar')
ON CONFLICT (code) DO NOTHING;

-- 2. WARDS
INSERT INTO wards (id, ward_number, name, zone_id, locality) VALUES
  ('b1b2c3d4-0001-0000-0000-000000000001', 174, 'Jayanagar', 'a1b2c3d4-0001-0000-0000-000000000001', 'Jayanagar 4th Block'),
  ('b1b2c3d4-0002-0000-0000-000000000002', 177, 'BTM Layout', 'a1b2c3d4-0001-0000-0000-000000000001', 'BTM 2nd Stage'),
  ('b1b2c3d4-0003-0000-0000-000000000003', 151, 'Koramangala', 'a1b2c3d4-0001-0000-0000-000000000001', 'Koramangala 5th Block'),
  ('b1b2c3d4-0004-0000-0000-000000000004', 81, 'Indiranagar', 'a1b2c3d4-0003-0000-0000-000000000003', 'Indiranagar 100 Feet Road'),
  ('b1b2c3d4-0005-0000-0000-000000000005', 56, 'Whitefield', 'a1b2c3d4-0003-0000-0000-000000000003', 'Whitefield Main Road'),
  ('b1b2c3d4-0006-0000-0000-000000000006', 125, 'Rajajinagar', 'a1b2c3d4-0004-0000-0000-000000000004', 'Rajajinagar 1st Block'),
  ('b1b2c3d4-0007-0000-0000-000000000007', 94, 'Malleswaram', 'a1b2c3d4-0002-0000-0000-000000000002', 'Malleswaram 8th Cross'),
  ('b1b2c3d4-0008-0000-0000-000000000008', 6, 'Hebbal', 'a1b2c3d4-0002-0000-0000-000000000002', 'Hebbal Flyover')
ON CONFLICT (ward_number) DO NOTHING;

-- 3. DEPARTMENTS
INSERT INTO departments (id, name, code, zone_id, contact_email, contact_phone) VALUES
  ('c1b2c3d4-0001-0000-0000-000000000001', 'South Sub-Division Operations', 'DEPT-SZ-OPS', 'a1b2c3d4-0001-0000-0000-000000000001', 'south.ops@vidyutspandan.gov.in', '+91-80-22222101'),
  ('c1b2c3d4-0002-0000-0000-000000000002', 'East Sub-Division Operations', 'DEPT-EZ-OPS', 'a1b2c3d4-0003-0000-0000-000000000003', 'east.ops@vidyutspandan.gov.in', '+91-80-22222102')
ON CONFLICT (code) DO NOTHING;

-- 4. FEEDERS
INSERT INTO feeders (id, feeder_code, feeder_name, substation_name, voltage_class, service_area, zone_id, status, circuit_length_km, peak_load_mw) VALUES
  ('d1b2c3d4-0001-0000-0000-000000000001', 'FDR-SZ-001', 'South Zone Feeder 1', 'Jayanagar 220kV Substation', '11kV', 'Jayanagar, BTM, Koramangala', 'a1b2c3d4-0001-0000-0000-000000000001', 'operational', 8.5, 4.2),
  ('d1b2c3d4-0002-0000-0000-000000000002', 'FDR-EZ-001', 'East Zone Feeder 1', 'Indiranagar 110kV Substation', '11kV', 'Indiranagar, Whitefield, HAL', 'a1b2c3d4-0003-0000-0000-000000000003', 'operational', 12.3, 6.8),
  ('d1b2c3d4-0003-0000-0000-000000000003', 'FDR-NZ-001', 'North Zone Feeder 1', 'Malleswaram 110kV Substation', '11kV', 'Malleswaram, Hebbal, Yeshwanthpur', 'a1b2c3d4-0002-0000-0000-000000000002', 'faulty', 9.7, 3.9)
ON CONFLICT (feeder_code) DO NOTHING;

-- 5. DEMO STREETLIGHTS (INFRASTRUCTURE ASSETS + EXTENSION)
INSERT INTO infrastructure_assets (id, asset_code, type, name, ward_id, zone_id, locality, latitude, longitude, status, installation_date, last_inspection_date) VALUES
  ('e1b2c3d4-0001-0000-0000-000000000001', 'SL-JYN-001', 'streetlight', 'Jayanagar 4th Block - Pole 1', 'b1b2c3d4-0001-0000-0000-000000000001', 'a1b2c3d4-0001-0000-0000-000000000001', 'Jayanagar 4th Block', 12.9279000, 77.5833000, 'working', '2022-03-15', '2024-10-01'),
  ('e1b2c3d4-0002-0000-0000-000000000002', 'SL-JYN-002', 'streetlight', 'Jayanagar 4th Block - Pole 2', 'b1b2c3d4-0001-0000-0000-000000000001', 'a1b2c3d4-0001-0000-0000-000000000001', 'Jayanagar 4th Block', 12.9282000, 77.5837000, 'faulty', '2022-03-15', '2024-09-15'),
  ('e1b2c3d4-0003-0000-0000-000000000003', 'SL-BTM-001', 'streetlight', 'BTM 2nd Stage Main Road - P1', 'b1b2c3d4-0002-0000-0000-000000000002', 'a1b2c3d4-0001-0000-0000-000000000001', 'BTM 2nd Stage', 12.9166000, 77.6101000, 'working', '2021-07-20', '2024-09-20'),
  ('e1b2c3d4-0004-0000-0000-000000000004', 'SL-KOR-001', 'streetlight', 'Koramangala 5th Block - P1', 'b1b2c3d4-0003-0000-0000-000000000003', 'a1b2c3d4-0001-0000-0000-000000000001', 'Koramangala 5th Block', 12.9345000, 77.6193000, 'under_maintenance', '2020-11-10', '2024-10-05'),
  ('e1b2c3d4-0005-0000-0000-000000000005', 'SL-IND-001', 'streetlight', 'Indiranagar 100 Feet Road - P1', 'b1b2c3d4-0004-0000-0000-000000000004', 'a1b2c3d4-0003-0000-0000-000000000003', 'Indiranagar', 12.9784000, 77.6408000, 'working', '2023-01-05', '2024-09-25')
ON CONFLICT (asset_code) DO NOTHING;

INSERT INTO streetlights (id, pole_type, lamp_type, wattage, circuit_id) VALUES
  ('e1b2c3d4-0001-0000-0000-000000000001', 'GI Pipe', 'LED', 45, 'CKT-JYN-01'),
  ('e1b2c3d4-0002-0000-0000-000000000002', 'GI Pipe', 'LED', 45, 'CKT-JYN-01'),
  ('e1b2c3d4-0003-0000-0000-000000000003', 'Steel Tubular', 'LED', 60, 'CKT-BTM-01'),
  ('e1b2c3d4-0004-0000-0000-000000000004', 'RCC', 'CFL', 70, 'CKT-KOR-01'),
  ('e1b2c3d4-0005-0000-0000-000000000005', 'Steel Tubular', 'LED', 55, 'CKT-IND-01')
ON CONFLICT (id) DO NOTHING;

-- 6. DEMO TRANSFORMERS (INFRASTRUCTURE ASSETS + EXTENSION)
INSERT INTO infrastructure_assets (id, asset_code, type, name, ward_id, zone_id, locality, latitude, longitude, status, installation_date, last_inspection_date) VALUES
  ('f1b2c3d4-0001-0000-0000-000000000001', 'DTR-JYN-001', 'transformer', 'Jayanagar DTR-1', 'b1b2c3d4-0001-0000-0000-000000000001', 'a1b2c3d4-0001-0000-0000-000000000001', 'Jayanagar 4th Block', 12.9270000, 77.5820000, 'working', '2019-06-15', '2024-09-01'),
  ('f1b2c3d4-0002-0000-0000-000000000002', 'DTR-KOR-001', 'transformer', 'Koramangala DTR-1', 'b1b2c3d4-0003-0000-0000-000000000003', 'a1b2c3d4-0001-0000-0000-000000000001', 'Koramangala 6th Block', 12.9358000, 77.6210000, 'faulty', '2021-03-20', '2024-10-02')
ON CONFLICT (asset_code) DO NOTHING;

INSERT INTO transformers (id, capacity_kva, voltage_ratio, feeder_id, make, serial_number, oil_level_status) VALUES
  ('f1b2c3d4-0001-0000-0000-000000000001', 100, '11kV/415V', 'd1b2c3d4-0001-0000-0000-000000000001', 'BHEL', 'BHEL-2019-0421', 'Normal'),
  ('f1b2c3d4-0002-0000-0000-000000000002', 200, '11kV/415V', 'd1b2c3d4-0001-0000-0000-000000000001', 'Kirloskar', 'KKL-2021-1105', 'Low Oil Alert')
ON CONFLICT (id) DO NOTHING;
