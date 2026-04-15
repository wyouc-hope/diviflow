"""
分红相关 Pydantic schema
"""
from datetime import date

from app.schemas.common import CamelBase


class DividendEventOut(CamelBase):
    """分红事件响应"""

    id: str
    symbol: str
    holding_id: str | None = None
    per_share: float
    currency: str
    stage: str
    record_date: date | None = None
    ex_dividend_date: date | None = None
    pay_date: date | None = None


class FIProgressOut(CamelBase):
    """财务自由进度响应"""

    monthly_dividend_estimate: float
    monthly_expense_target: float
    coverage_ratio: float
    next_milestone: str | None = None
