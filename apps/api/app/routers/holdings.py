"""
持仓路由
"""
from fastapi import APIRouter, HTTPException, status

from app.core.deps import CurrentUserId, DbSession
from app.schemas.holding import (
    HoldingCreate,
    HoldingOut,
    HoldingUpdate,
    PortfolioSummary,
    ScanHoldingsIn,
    ScanHoldingsOut,
)
from app.services.holding_service import HoldingService

router = APIRouter(prefix="/holdings", tags=["holdings"])


@router.get("", response_model=list[HoldingOut])
def list_holdings(user_id: CurrentUserId, db: DbSession) -> list[HoldingOut]:
    """查询当前用户全部持仓"""
    return [HoldingOut.model_validate(h) for h in HoldingService(db).list_for_user(user_id)]


@router.get("/summary", response_model=PortfolioSummary)
def portfolio_summary(user_id: CurrentUserId, db: DbSession) -> PortfolioSummary:
    """组合概览"""
    return HoldingService(db).compute_summary(user_id)


@router.post("", response_model=HoldingOut, status_code=status.HTTP_201_CREATED)
def create_holding(
    payload: HoldingCreate, user_id: CurrentUserId, db: DbSession
) -> HoldingOut:
    """新增持仓"""
    holding = HoldingService(db).create(user_id, payload)
    return HoldingOut.model_validate(holding)


@router.put("/{holding_id}", response_model=HoldingOut)
def update_holding(
    holding_id: str, payload: HoldingUpdate, user_id: CurrentUserId, db: DbSession
) -> HoldingOut:
    """更新持仓"""
    holding = HoldingService(db).update(user_id, holding_id, payload)
    if holding is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="持仓不存在")
    return HoldingOut.model_validate(holding)


@router.delete("/{holding_id}")
def delete_holding(holding_id: str, user_id: CurrentUserId, db: DbSession) -> dict[str, bool]:
    """删除持仓"""
    ok = HoldingService(db).delete(user_id, holding_id)
    if not ok:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="持仓不存在")
    return {"ok": True}


@router.post("/scan", response_model=ScanHoldingsOut)
def scan_holdings(
    payload: ScanHoldingsIn, user_id: CurrentUserId, db: DbSession
) -> ScanHoldingsOut:
    """AI 扫描持仓截图（占位实现）"""
    _ = payload, user_id, db
    # TODO: 调用 OpenAI/Vision API 并返回结构化候选
    return ScanHoldingsOut(candidates=[])
