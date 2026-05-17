from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from database import supabase
from services.budget_engine import compute_surplus

router = APIRouter()

class BudgetCreate(BaseModel):
    category: str
    monthly_limit: float

class IncomeUpdate(BaseModel):
    monthly_income: float

@router.post("/")
def create_budget(data: BudgetCreate, user_id: str = Header(...)):
    try:
        res = supabase.table("budgets").insert({
            "user_id": user_id,
            "category": data.category,
            "monthly_limit": data.monthly_limit,
            "current_spend": 0,
        }).execute()
        return res.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/")
def get_budgets(user_id: str = Header(...)):
    res = supabase.table("budgets").select("*").eq("user_id", user_id).execute()
    return res.data

@router.get("/summary")
def get_summary(user_id: str = Header(...)):
    budgets = supabase.table("budgets").select("*").eq("user_id", user_id).execute().data
    user = supabase.table("users").select("monthly_income").eq("id", user_id).execute().data
    income = user[0]["monthly_income"] if user else 0
    return compute_surplus(income, budgets)

@router.put("/income")
def update_income(data: IncomeUpdate, user_id: str = Header(...)):
    supabase.table("users").update({"monthly_income": data.monthly_income}).eq("id", user_id).execute()
    return {"message": "Income updated"}