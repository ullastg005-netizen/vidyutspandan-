import sys
import os

# Ensure backend directory is on Python path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.responses import Response

try:
    from core.config import settings
    from routes import auth, assets, work_orders, public_services, reports
except ImportError:
    try:
        from backend.core.config import settings
        from backend.routes import auth, assets, work_orders, public_services, reports
    except ImportError:
        try:
            from api.core.config import settings
            from api.routes import auth, assets, work_orders, public_services, reports
        except ImportError:
            from app.core.config import settings
            from app.api.routes import auth, assets, work_orders, public_services, reports

app = FastAPI(
    title="VIDYUT SPANDAN (ವಿದ್ಯುತ್ ಸ್ಪಂದನ) API",
    description="Unified Distribution Infrastructure Operations & Maintenance Coordination Platform for BESCOM",
    version=settings.VERSION,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers with both /api and /api/v1 prefixes for maximum compatibility
for pfx in [settings.API_V1_STR, f"{settings.API_V1_STR}/v1"]:
    app.include_router(auth.router, prefix=pfx)
    app.include_router(assets.router, prefix=pfx)
    app.include_router(work_orders.router, prefix=pfx)
    app.include_router(public_services.router, prefix=pfx)
    app.include_router(reports.router, prefix=pfx)

@app.get("/")
@app.get("/api")
@app.get("/api/")
@app.get("/api/v1")
@app.get("/api/v1/")
async def root():
    return {
        "platform": "VIDYUT SPANDAN (ವಿದ್ಯುತ್ ಸ್ಪಂದನ)",
        "project": "BESCOM Distribution Operations",
        "status": "operational",
        "docs": "/api/docs"
    }

@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    return get_swagger_ui_html(openapi_url="/api/openapi.json", title="Vidyut Spandan API Docs")

@app.get("/health")
@app.get("/api/health")
@app.get("/api/v1/health")
async def health_check():
    return {"status": "healthy", "service": "vidyut-spandan-backend"}

@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return Response(status_code=204)
