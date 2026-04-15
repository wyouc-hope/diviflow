"""
端到端 smoke test — 复现前端 Home 页首屏数据链路：
    POST /auth/login → GET /holdings + /holdings/summary
"""
from fastapi.testclient import TestClient

from app.main import app


def test_home_empty_portfolio_flow() -> None:
    """新用户登录后，Home 页首次加载应拿到空持仓 + 零组合汇总"""
    client = TestClient(app)

    # 1. 登录
    login_resp = client.post(
        "/auth/login", json={"phone": "13900000001", "code": "0000"}
    )
    assert login_resp.status_code == 200
    token = login_resp.json()["tokens"]["accessToken"]
    assert token

    headers = {"Authorization": f"Bearer {token}"}

    # 2. 分页持仓列表：空
    holdings_resp = client.get(
        "/holdings", params={"page": 1, "pageSize": 50}, headers=headers
    )
    assert holdings_resp.status_code == 200
    paginated = holdings_resp.json()
    assert paginated["items"] == []
    assert paginated["total"] == 0
    assert paginated["page"] == 1
    assert paginated["pageSize"] == 50

    # 3. 组合汇总：全 0
    summary_resp = client.get("/holdings/summary", headers=headers)
    assert summary_resp.status_code == 200
    summary = summary_resp.json()
    assert summary["baseCurrency"] == "CNY"
    assert summary["totalMarketValue"] == 0.0
    assert summary["totalCost"] == 0.0
    assert summary["unrealizedPnl"] == 0.0
    assert summary["annualDividendEstimate"] == 0.0


def test_unauthorized_request_rejected() -> None:
    """未携带 Token 访问受保护接口应返回 401"""
    client = TestClient(app)
    resp = client.get("/holdings")
    assert resp.status_code == 401
