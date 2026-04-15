"""
登录流程 smoke test — 校验自动建用户 + Token 签发
"""
from fastapi.testclient import TestClient

from app.main import app


def test_login_creates_user() -> None:
    """首次登录应自动创建用户并返回 token"""
    client = TestClient(app)
    resp = client.post("/auth/login", json={"phone": "13800000000", "code": "0000"})
    assert resp.status_code == 200
    data = resp.json()
    assert data["user"]["phone"] == "13800000000"
    assert data["tokens"]["accessToken"]
    assert data["user"]["baseCurrency"] == "CNY"
