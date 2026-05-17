from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from typing import Optional
from database import supabase
from services.anomaly_engine import check_anomaly

router = APIRouter()

class TransactionCreate(BaseModel):
    amount: float
    category: str
    description: Optional[str] = ""
    date: Optional[str] = None

@router.post("/")
def add_transaction(data: TransactionCreate, user_id: str = Header(...)):
    try:
        payload = {
            "user_id": user_id,
            "amount": data.amount,
            "category": data.category,
            "description": data.description,
        }
        if data.date:
            payload["date"] = data.date
        res = supabase.table("transactions").insert(payload).execute()
        tx = res.data[0]
        check_anomaly(user_id, tx)
        supabase.rpc("increment_spend", {
            "p_user_id": user_id,
            "p_category": data.category,
            "p_amount": data.amount,
        }).execute()
        return tx
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/")
def get_transactions(user_id: str = Header(...)):
    res = supabase.table("transactions")\
        .select("*")\
        .eq("user_id", user_id)\
        .order("date", desc=True)\
        .limit(50)\
        .execute()
    return res.data