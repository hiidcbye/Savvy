from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import supabase

router = APIRouter()

class SignUpRequest(BaseModel):
    email: str
    password: str
    name: str

class SignInRequest(BaseModel):
    email: str
    password: str

@router.post("/signup")
def signup(data: SignUpRequest):
    try:
        res = supabase.auth.sign_up({
            "email": data.email,
            "password": data.password,
        })
        supabase.table("users").insert({
            "id": res.user.id,
            "email": data.email,
            "name": data.name,
        }).execute()
        return {"message": "Account created", "user_id": res.user.id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/signin")
def signin(data: SignInRequest):
    try:
        res = supabase.auth.sign_in_with_password({
            "email": data.email,
            "password": data.password,
        })
        return {
            "access_token": res.session.access_token,
            "user_id": res.user.id,
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid credentials")