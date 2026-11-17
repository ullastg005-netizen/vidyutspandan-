from supabase import create_client, Client

try:
    from core.config import settings
except ImportError:
    try:
        from api.core.config import settings
    except ImportError:
        from app.core.config import settings

def get_supabase_client() -> Client:
    # Use service role key if available for backend administrative queries
    key = settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_KEY
    return create_client(settings.SUPABASE_URL, key)

supabase_client = get_supabase_client()
