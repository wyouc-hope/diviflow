"""
持仓 ORM 模型
"""
from datetime import datetime
from uuid import uuid4

from sqlalchemy import DateTime, ForeignKey, Numeric, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Holding(Base):
    """持仓表 — 每条记录 = 用户的一只股票持仓"""

    __tablename__ = "holdings"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), index=True)

    symbol: Mapped[str] = mapped_column(String(32), index=True)
    market: Mapped[str] = mapped_column(String(16), default="OTHER")
    currency: Mapped[str] = mapped_column(String(8), default="USD")
    name: Mapped[str] = mapped_column(String(128), default="")

    shares: Mapped[float] = mapped_column(Numeric(20, 4), default=0)
    avg_cost: Mapped[float] = mapped_column(Numeric(20, 4), default=0)
    first_buy_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    note: Mapped[str | None] = mapped_column(String(512))

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
