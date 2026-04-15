from fastapi import APIRouter, HTTPException, status
import os

router = APIRouter(prefix="/api/recommendations", tags=["Job Recommendations"])

MAINTENANCE_MODE = os.getenv("RECOMMENDATIONS_MAINTENANCE", "true").lower() in ("1", "true", "yes", "on")


def _paywall():
    raise HTTPException(
        status_code=status.HTTP_402_PAYMENT_REQUIRED,
        detail={
            "message": "Job Recommendations are under maintenance. Please make a payment to get access.",
            "feature": "job_recommendations",
            "status": "maintenance",
        },
    )


@router.get("/")
async def status_check():
    if MAINTENANCE_MODE:
        _paywall()
    return {"status": "ok"}

