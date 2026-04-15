"""
用户 ORM 模型
"""
from datetime import datetime
from uuid import uuid4

from sqlalchemy import DateTime, Numeric, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class User(Base):
    """用户表"""

    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    phone: Mapped[str | None] = mapped_column(String(32), unique=True, index=True)
    email: Mapped[str | None] = mapped_column(String(128), unique=True, index=True)
    password_hash: Mapped[str | None] = mapped_column(String(255))
    nickname: Mapped[str] = mapped_column(String(64), default="")
    avatar_url: Mapped[str | None] = mapped_column(String(512))

    region: Mapped[str] = mapped_column(String(8), default="CN")
    base_currency: Mapped[str] = mapped_column(String(8), default="CNY")
    monthly_expense_target: Mapped[float] = mapped_column(Numeric(18, 2), default=0)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
