"""
分红路由
"""
from fastapi import APIRouter, Query

from app.core.deps import CurrentUserId, DbSession
from app.models.user import User
from app.schemas.dividend import DividendEventOut, FIProgressOut
from app.services.dividend_service import DividendService

router = APIRouter(prefix="/dividends", tags=["dividends"])


@router.get("/calendar", response_model=list[DividendEventOut])
def calendar(
    db: DbSession,
    year: int = Query(..., ge=2000, le=3000),
    month: int = Query(..., ge=1, le=12),
) -> list[DividendEventOut]:
    """按月查询分红日历事件"""
    events = DividendService(db).events_in_month(year, month)
    return [DividendEventOut.model_validate(e) for e in events]


@router.get("/fi-progress", response_model=FIProgressOut)
def fi_progress(user_id: CurrentUserId, db: DbSession) -> FIProgressOut:
    """财务自由覆盖率"""
    user = db.query(User).filter(User.id == user_id).one_or_none()
    target = float(user.monthly_expense_target) if user else 0.0
    return DividendService(db).fi_progress(user_id=user_id, monthly_expense_target=target)
