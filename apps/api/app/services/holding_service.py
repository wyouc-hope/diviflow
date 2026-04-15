"""
持仓业务逻辑
"""
from sqlalchemy.orm import Session

from app.models.holding import Holding
from app.schemas.holding import HoldingCreate, HoldingUpdate, PortfolioSummary


class HoldingService:
    """持仓服务"""

    def __init__(self, db: Session) -> None:
        self.db = db

    def list_for_user(self, user_id: str) -> list[Holding]:
        """查询用户全部持仓"""
        return self.db.query(Holding).filter(Holding.user_id == user_id).all()

    def create(self, user_id: str, payload: HoldingCreate) -> Holding:
        """新增持仓"""
        holding = Holding(
            user_id=user_id,
            symbol=payload.symbol,
            shares=payload.shares,
            avg_cost=payload.avg_cost,
            first_buy_at=payload.first_buy_at,
            note=payload.note,
        )
        self.db.add(holding)
        self.db.commit()
        self.db.refresh(holding)
        return holding

    def update(self, user_id: str, holding_id: str, payload: HoldingUpdate) -> Holding | None:
        """更新持仓"""
        holding = (
            self.db.query(Holding)
            .filter(Holding.id == holding_id, Holding.user_id == user_id)
            .one_or_none()
        )
        if holding is None:
            return None
        holding.symbol = payload.symbol
        holding.shares = payload.shares
        holding.avg_cost = payload.avg_cost
        holding.first_buy_at = payload.first_buy_at
        holding.note = payload.note
        self.db.commit()
        self.db.refresh(holding)
        return holding

    def delete(self, user_id: str, holding_id: str) -> bool:
        """删除持仓"""
        holding = (
            self.db.query(Holding)
            .filter(Holding.id == holding_id, Holding.user_id == user_id)
            .one_or_none()
        )
        if holding is None:
            return False
        self.db.delete(holding)
        self.db.commit()
        return True

    def compute_summary(self, user_id: str, base_currency: str = "CNY") -> PortfolioSummary:
        """计算组合概览（市值需要行情接口支撑，此处先用 avg_cost * shares 作为占位）"""
        holdings = self.list_for_user(user_id)
        total_cost = sum(float(h.avg_cost) * float(h.shares) for h in holdings)
        # TODO: 接入实时行情后用 last_price 替换
        total_market_value = total_cost
        unrealized_pnl = total_market_value - total_cost
        unrealized_pnl_pct = (unrealized_pnl / total_cost) if total_cost else 0.0
        return PortfolioSummary(
            base_currency=base_currency,
            total_market_value=total_market_value,
            total_cost=total_cost,
            unrealized_pnl=unrealized_pnl,
            unrealized_pnl_pct=unrealized_pnl_pct,
            annual_dividend_estimate=0.0,
        )
