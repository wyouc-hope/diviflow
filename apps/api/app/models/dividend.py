"""
分红事件 ORM 模型
"""
from datetime import date, datetime
from uuid import uuid4

from sqlalchemy import Date, DateTime, ForeignKey, Numeric, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class DividendEvent(Base):
    """分红事件（登记日 / 除权除息 / 派息 / 到账）"""

    __tablename__ = "dividend_events"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    symbol: Mapped[str] = mapped_column(String(32), index=True)
    # 可选关联到具体持仓（多用户场景下不强绑定）
    holding_id: Mapped[str | None] = mapped_column(
        String(36), ForeignKey("holdings.id"), index=True
    )

    per_share: Mapped[float] = mapped_column(Numeric(20, 6), default=0)
    currency: Mapped[str] = mapped_column(String(8), default="USD")
    stage: Mapped[str] = mapped_column(String(16), default="announced")

    record_date: Mapped[date | None] = mapped_column(Date)
    ex_dividend_date: Mapped[date | None] = mapped_column(Date)
    pay_date: Mapped[date | None] = mapped_column(Date)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
