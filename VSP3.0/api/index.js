// VIDYUT SPANDAN (ವಿದ್ಯುತ್ ಸ್ಪಂದನ) - Unified Serverless API Handler
// Zero-dependency Node.js Serverless Handler for single-click Vercel deployment

const DEMO_ACCOUNTS = {
  'admin@vidyutspandan.gov.in': { password: 'Admin@1234', role: 'admin', name: 'Rajesh Kumar Sharma' },
  'officer@vidyutspandan.gov.in': { password: 'Officer@1234', role: 'officer', name: 'Priya Venkatesh' },
  'worker@vidyutspandan.gov.in': { password: 'Worker@1234', role: 'worker', name: 'Suresh Babu' },
  'supervisor@vidyutspandan.gov.in': { password: 'Supervisor@1234', role: 'supervisor', name: 'Anitha Krishnamurthy' },
};

const PUBLIC_COMPLAINTS_DB = {
  'VS2024110001': {
    tracking_id: 'VS2024110001',
    requester_name: 'Ramesh Nair',
    requester_phone: '9876500001',
    issue_type: 'streetlight_fault',
    description: 'Street light near our apartment not working since last week.',
    location_address: 'No. 15, 4th Cross, Jayanagar 3rd Block',
    status: 'in_progress',
    resolution_notes: null,
    created_at: '2024-11-05T18:30:00Z',
  },
  'VS2024110002': {
    tracking_id: 'VS2024110002',
    requester_name: 'Sunita Rao',
    requester_phone: '9876500002',
    issue_type: 'infrastructure_damage',
    description: 'Electric pole looks unstable after recent rains.',
    location_address: 'BTM 1st Stage, 100 Feet Road',
    status: 'acknowledged',
    resolution_notes: null,
    created_at: '2024-11-06T10:00:00Z',
  },
  'VS2024110003': {
    tracking_id: 'VS2024110003',
    requester_name: 'Manjunath Gowda',
    requester_phone: '9876500003',
    issue_type: 'transformer_spark',
    description: 'Intermittent sparking from distribution transformer box during evening peak load.',
    location_address: 'Opp. BDA Complex, Koramangala 4th Block',
    status: 'resolved',
    resolution_notes: 'Jumper wire re-crimped and phase insulator replaced by Lineman team.',
    created_at: '2024-11-04T14:15:00Z',
  },
};

const STREETLIGHTS_DB = [
  {
    id: 'sl-001',
    pole_code: 'BESCOM-JNR-SL-041',
    ward_no: 153,
    ward_name: 'Jayanagar 4th Block',
    location: { lat: 12.9299, lng: 77.5824 },
    status: 'faulty',
    wattage: 120,
    lamp_type: 'LED',
    last_inspected: '2024-11-01',
  },
  {
    id: 'sl-002',
    pole_code: 'BESCOM-JNR-SL-042',
    ward_no: 153,
    ward_name: 'Jayanagar 4th Block',
    location: { lat: 12.9312, lng: 77.5835 },
    status: 'working',
    wattage: 120,
    lamp_type: 'LED',
    last_inspected: '2024-11-03',
  },
  {
    id: 'sl-003',
    pole_code: 'BESCOM-KRM-SL-109',
    ward_no: 151,
    ward_name: 'Koramangala 5th Block',
    location: { lat: 12.9352, lng: 77.6245 },
    status: 'maintenance',
    wattage: 150,
    lamp_type: 'LED',
    last_inspected: '2024-10-28',
  },
];

const TRANSFORMERS_DB = [
  {
    id: 'dtr-001',
    code: 'DTR-JNR-01',
    capacity_kva: 250,
    ward_no: 153,
    ward_name: 'Jayanagar',
    load_percentage: 78.4,
    oil_level: 'optimal',
    status: 'operational',
    location: { lat: 12.9315, lng: 77.5842 },
  },
  {
    id: 'dtr-002',
    code: 'DTR-BTM-04',
    capacity_kva: 500,
    ward_no: 176,
    ward_name: 'BTM Layout',
    load_percentage: 92.1,
    oil_level: 'warning',
    status: 'overloaded',
    location: { lat: 12.9165, lng: 77.6101 },
  },
];

const FEEDERS_DB = [
  {
    id: 'fdr-001',
    code: 'FDR-11KV-S04',
    name: '11kV South Ring Feeder F-04',
    substation: '220/66/11kV Jayanagar Major Substation',
    peak_load_amps: 285,
    capacity_amps: 350,
    status: 'energized',
  },
];

const WORK_ORDERS_DB = [
  {
    id: 'wo-001',
    order_number: 'WO-2024-1102',
    title: 'Faulty LED luminaire replacement',
    priority: 'high',
    status: 'assigned',
    assigned_to: 'Suresh Babu (Lineman #402)',
    assigned_to_id: 'worker-001',
    asset_code: 'BESCOM-JNR-SL-041',
    location: 'Jayanagar 4th Block, 9th Main',
    created_at: '2024-11-02T09:30:00Z',
  },
  {
    id: 'wo-002',
    order_number: 'WO-2024-1105',
    title: 'Transformer Bushing & Radiator Inspection',
    priority: 'critical',
    status: 'in_progress',
    assigned_to: 'Suresh Babu (Lineman #402)',
    assigned_to_id: 'worker-001',
    asset_code: 'DTR-BTM-04',
    location: 'BTM Layout 100 Feet Rd Junction',
    created_at: '2024-11-05T08:00:00Z',
  },
];

async function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
  });
}

function sendJson(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.end(JSON.stringify(data));
}

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.end();
    return;
  }

  // Parse path & normalize both /api and /api/v1 prefixes
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = parsedUrl.pathname.replace(/\/+$/, '') || '/';
  const normalizedPath = pathname.replace(/^\/api\/v1/, '/api');

  // 1. Root & Health
  if (normalizedPath === '' || normalizedPath === '/' || normalizedPath === '/api') {
    return sendJson(res, 200, {
      platform: 'VIDYUT SPANDAN (ವಿದ್ಯುತ್ ಸ್ಪಂದನ)',
      project: 'BESCOM Distribution Operations',
      status: 'operational',
      docs: '/api/docs',
    });
  }

  if (normalizedPath === '/api/health' || normalizedPath === '/health') {
    return sendJson(res, 200, {
      status: 'healthy',
      service: 'vidyut-spandan-backend',
    });
  }

  // 2. Auth: POST /api/auth/login or /api/v1/auth/login
  if (normalizedPath === '/api/auth/login' && req.method === 'POST') {
    const body = await parseBody(req);
    const email = (body.email || '').toLowerCase().trim();
    const account = DEMO_ACCOUNTS[email];

    if (!account || account.password !== body.password) {
      return sendJson(res, 401, { detail: 'Invalid official email or password.' });
    }

    return sendJson(res, 200, {
      access_token: `demo-jwt-${Date.now()}-${account.role}`,
      token_type: 'bearer',
      user: {
        email: email,
        full_name: account.name,
        role: account.role,
      },
    });
  }

  // Auth Profile: GET /api/auth/me or /api/v1/auth/me
  if (normalizedPath === '/api/auth/me') {
    return sendJson(res, 200, {
      email: 'officer@vidyutspandan.gov.in',
      full_name: 'Priya Venkatesh',
      role: 'officer',
    });
  }

  // 3. Assets
  if (normalizedPath === '/api/assets/streetlights') {
    return sendJson(res, 200, { data: STREETLIGHTS_DB, total: STREETLIGHTS_DB.length });
  }

  if (normalizedPath === '/api/assets/transformers') {
    return sendJson(res, 200, { data: TRANSFORMERS_DB, total: TRANSFORMERS_DB.length });
  }

  if (normalizedPath === '/api/assets/feeders') {
    return sendJson(res, 200, { data: FEEDERS_DB, total: FEEDERS_DB.length });
  }

  // 4. Work Orders
  if (normalizedPath === '/api/work-orders') {
    if (req.method === 'POST') {
      const body = await parseBody(req);
      const newOrder = {
        id: `wo-${Date.now()}`,
        order_number: `WO-2024-${Math.floor(1000 + Math.random() * 9000)}`,
        title: body.title || 'Distribution Line Maintenance',
        priority: body.priority || 'medium',
        status: 'assigned',
        assigned_to: body.assigned_to || 'Suresh Babu (Lineman #402)',
        created_at: new Date().toISOString(),
        ...body,
      };
      WORK_ORDERS_DB.unshift(newOrder);
      return sendJson(res, 201, { data: newOrder });
    }
    return sendJson(res, 200, { data: WORK_ORDERS_DB, total: WORK_ORDERS_DB.length });
  }

  // 5. Public Grievances
  if (normalizedPath === '/api/public/complaint' && req.method === 'POST') {
    const body = await parseBody(req);
    const tracking_id = `VS2024${Math.floor(100000 + Math.random() * 900000)}`;
    const record = {
      tracking_id,
      requester_name: body.requester_name || 'Citizen',
      requester_phone: body.requester_phone || '',
      issue_type: body.issue_type || 'streetlight_fault',
      description: body.description || '',
      location_address: body.location_address || '',
      status: 'submitted',
      created_at: new Date().toISOString(),
    };
    PUBLIC_COMPLAINTS_DB[tracking_id] = record;
    return sendJson(res, 200, {
      tracking_id,
      status: 'submitted',
      message: 'Complaint registered successfully. Your Sub-Division Officer will review shortly.',
    });
  }

  // Public Track: GET /api/public/track/:id
  const trackMatch = normalizedPath.match(/^\/api\/public\/track\/(.+)$/);
  if (trackMatch) {
    const trackingId = trackMatch[1].toUpperCase().trim();
    const complaint = PUBLIC_COMPLAINTS_DB[trackingId];
    if (!complaint) {
      return sendJson(res, 404, { detail: 'No grievance found matching this tracking reference ID.' });
    }
    return sendJson(res, 200, { data: complaint });
  }

  // 6. Reports Summary
  if (normalizedPath === '/api/reports/summary') {
    return sendJson(res, 200, {
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
      uptime_percentage: 94.8,
      mttr_hours: 3.4,
    });
  }

  // Fallback 404
  return sendJson(res, 404, { detail: `Endpoint not found: ${pathname}` });
}
