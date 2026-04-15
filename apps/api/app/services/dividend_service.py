"""
分红业务逻辑
"""
from datetime import date
from sqlalchemy import extract
from sqlalchemy.orm import Session

from app.models.dividend import DividendEvent
from app.schemas.dividend import FIProgressOut


class DividendService:
    """分红服务"""

    def __init__(self, db: Session) -> None:
        self.db = db

    def events_in_month(self, year: int, month: int) -> list[DividendEvent]:
        """按月查询分红事件（基于 pay_date）"""
        return (
            self.db.query(DividendEvent)
            .filter(
                extract("year", DividendEvent.pay_date) == year,
                extract("month", DividendEvent.pay_date) == month,
            )
            .all()
        )

    def fi_progress(self, user_id: str, monthly_expense_target: float) -> FIProgressOut:
        """财务自由进度（TODO: 基于实际持仓 + 最新分红数据计算）"""
        _ = user_id
        # 占位：0 收入
        monthly_dividend_estimate = 0.0
        coverage = (
            monthly_dividend_estimate / monthly_expense_target if monthly_expense_target else 0.0
        )
        milestone = None
        if coverage < 0.5:
            milestone = "下一里程碑：覆盖率 50%"
        elif coverage < 1.0:
            milestone = "下一里程碑：完全覆盖"
        return FIProgressOut(
            monthly_dividend_estimate=monthly_dividend_estimate,
            monthly_expense_target=monthly_expense_target,
            coverage_ratio=coverage,
            next_milestone=milestone,
        )
