import pandas as pd
from database import supabase

ZSCORE_THRESHOLD = 2.0
BUFFER_DAYS = 7

def check_anomaly(user_id: str, transaction: dict):
    category = transaction["category"]
    amount = transaction["amount"]
    tx_id = transaction["id"]

    res = supabase.table("transactions")\
        .select("amount, date")\
        .eq("user_id", user_id)\
        .eq("category", category)\
        .order("date", desc=True)\
        .limit(60)\
        .execute()

    history = res.data
    if len(history) < BUFFER_DAYS:
        return

    df = pd.DataFrame(history)
    df["amount"] = pd.to_numeric(df["amount"])
    mean = df["amount"].mean()
    std = df["amount"].std()

    if std == 0:
        return

    z = (amount - mean) / std

    if abs(z) >= ZSCORE_THRESHOLD:
        reason = f"This {category} transaction of ₹{amount:.0f} is unusually {'higher' if z > 0 else 'lower'} than your usual ₹{mean:.0f} average (Z={z:.1f})."
        supabase.table("anomalies").insert({
            "user_id": user_id,
            "transaction_id": tx_id,
            "z_score": round(z, 3),
            "reason": reason,
        }).execute()