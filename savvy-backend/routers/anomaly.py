from fastapi import APIRouter, Header
from database import supabase

router = APIRouter()

@router.get("/")
def get_anomalies(user_id: str = Header(...)):
    res = supabase.table("anomalies")\
        .select("*, transactions(amount, category, description, date)")\
        .eq("user_id", user_id)\
        .order("detected_at", desc=True)\
        .limit(20)\
        .execute()
    return res.data