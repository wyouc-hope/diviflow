"""
持仓相关 Pydantic schema
"""
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class HoldingBase(BaseModel):
    """持仓公共字段"""

    symbol: str = Field(..., max_length=32)
    shares: float = Field(..., ge=0)
    avg_cost: float = Field(..., ge=0)
    first_buy_at: datetime | None = None
    note: str | None = Field(default=None, max_length=512)


class HoldingCreate(HoldingBase):
    """创建持仓入参"""


class HoldingUpdate(HoldingBase):
    """更新持仓入参"""


class HoldingOut(HoldingBase):
    """持仓响应"""

    id: str
    user_id: str
    market: str
    currency: str
    name: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PortfolioSummary(BaseModel):
    """组合概览"""

    base_currency: str
    total_market_value: float
    total_cost: float
    unrealized_pnl: float
    unrealized_pnl_pct: float
    annual_dividend_estimate: float


class ScanHoldingsIn(BaseModel):
    """AI 扫描截图入参"""

    image: str = Field(..., description="base64 编码的图片")


class ScanHoldingsOut(BaseModel):
    """AI 扫描解析结果"""

    candidates: list[HoldingCreate]
