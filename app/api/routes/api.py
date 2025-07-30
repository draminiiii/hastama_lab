# app/api/routes/api.py

from fastapi import APIRouter
from app.api.routes import predictor
from app.api.routes import auth  # جدید

router = APIRouter()

router.include_router(predictor.router, tags=["predictor"], prefix="/v1")
router.include_router(auth.router, tags=["auth"])

