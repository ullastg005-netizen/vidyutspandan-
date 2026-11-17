# VIDYUT SPANDAN (ವಿದ್ಯುತ್ ಸ್ಪಂದನ)
### GIS-Enabled Unified Distribution Infrastructure Operations & Maintenance Coordination Platform

**Project:** BESCOM Distribution Operations & Maintenance Coordination Platform  

---

## ⚡ Deployment to Vercel (1-Click Unified Deployment)

This repository is unified as a **single, zero-configuration project** ready for instant deployment on Vercel:

1. Push this folder to your GitHub repository.
2. In Vercel, click **"Add New Project"** and select your repository.
3. Vercel automatically detects the **Vite** framework with build command `npm run build` and output directory `dist`.
4. Click **"Deploy"**. The entire application (React 19 Frontend + Interactive GIS Maps + Department Portals + Serverless API Routes) will deploy in a single deployment with zero separate project configuration!

---

## 💻 Local Development

### Prerequisites
- **Node.js:** v18+ (tested on v20/v22/v24)
- **Python:** v3.10+ (optional, tested on v3.12)

### 1. Run Unified Frontend
```bash
npm install
npm run dev
```
Open **`http://localhost:3000`** in your browser. All interactive features, GIS maps, public complaint filing, citizen tracking, and role-based department portals work out of the box!

### 2. Run Python FastAPI Backend (Optional)
If you wish to run the Python FastAPI backend locally:
```bash
# Install dependencies
python -m pip install -r requirements-backend.txt

# Start FastAPI server on port 8000
python -m uvicorn api.index:app --host 127.0.0.1 --port 8000 --reload
```
Interactive API documentation will be available at **`http://127.0.0.1:8000/docs`**.

---

## 🔑 Demo Login Credentials

For evaluation and demonstration, the platform includes 1-click quick-fill buttons on the Department Login page (`/login`):

| Role | Official Email | Password | Access Scope |
|------|----------------|----------|--------------|
| **System Administrator** | `admin@vidyutspandan.gov.in` | `Admin@1234` | Central Control, User Governance, Audit Trail |
| **Department Officer** | `officer@vidyutspandan.gov.in` | `Officer@1234` | Sub-Division Dispatch, Faults, Work Orders |
| **Field Lineman** | `worker@vidyutspandan.gov.in` | `Worker@1234` | Suresh Babu Portal, Mobile Work Queue, Evidence |
| **Supervisor** | `supervisor@vidyutspandan.gov.in` | `Supervisor@1234` | QA Inspection, Verification Queue & Sign-Off |

---

## 🗺️ Demonstration Citizen Complaint Tracking IDs

To test the citizen grievance tracking feature on the homepage, use any of these sample tracking IDs:

- `VS2024110001` (In Progress — Jayanagar 3rd Block Streetlight Fault)
- `VS2024110002` (Acknowledged — BTM 1st Stage Leaning Pole)
- `VS2024110003` (Resolved — Indiranagar 12th Main Streetlight Restoration)

---

## 📁 Unified Repository Structure

```text
/VSP3.0
  /api                 # Unified API: Vercel Serverless (index.js) + FastAPI (index.py)
    index.js           # Production serverless handler for Vercel
    index.py           # FastAPI application for local Python development
    /core              # Config & security
    /routes            # Auth, assets, work orders, public services, reports
    /schemas           # Pydantic data schemas
    requirements-backend.txt # Python requirements for local execution
  /public              # Official logo and static assets
  /src
    /components        # Reusable UI widgets, GIS Map, PortalLayout, Navigation
    /context           # AuthContext with 4-role state management
    /features          # Feeders, streetlights, transformers, work orders, reports
    /pages             # Admin, Officer, Worker, Supervisor, Public Home & Map
    /services          # API client and Supabase service
    /utils             # Bengaluru demo data and formatting helpers
  /supabase
    /migrations        # PostgreSQL relational schema with RLS policies
    /seed              # Bengaluru demonstration seed records
  /docs                # System architecture documentation
  index.html           # Single-page application entrypoint
  package.json         # Node.js dependencies and scripts
  requirements-backend.txt # Local Python backend requirements
  vercel.json          # Vercel deployment and routing rules
  vite.config.ts       # Vite configuration with local proxy to port 8000
```

---

## 🏛️ Attribution

- **Project:** VIDYUT SPANDAN (ವಿದ್ಯುತ್ ಸ್ಪಂದನ)
- **Official Helpline:** 1912 / 112
