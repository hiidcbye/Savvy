BUFFER_PERCENT = 0.10

def compute_surplus(monthly_income: float, budgets: list) -> dict:
    total_limit = sum(b["monthly_limit"] for b in budgets)
    total_spent = sum(b["current_spend"] for b in budgets)
    buffer = monthly_income * BUFFER_PERCENT
    surplus = monthly_income - total_spent - buffer

    categories = []
    for b in budgets:
        pct = (b["current_spend"] / b["monthly_limit"] * 100) if b["monthly_limit"] else 0
        categories.append({
            "category": b["category"],
            "limit": b["monthly_limit"],
            "spent": b["current_spend"],
            "remaining": b["monthly_limit"] - b["current_spend"],
            "percent_used": round(pct, 1),
            "over_budget": b["current_spend"] > b["monthly_limit"],
            "alert": pct >= 80,
        })

    return {
        "monthly_income": monthly_income,
        "total_budgeted": total_limit,
        "total_spent": total_spent,
        "buffer": round(buffer, 2),
        "investable_surplus": round(surplus, 2),
        "categories": categories,
    }