"""
健康检查接口的 smoke test
"""
from fastapi.testclient import TestClient

from app.main import app


def test_root_ok() -> None:
    """根路径返回服务信息"""
    client = TestClient(app)
    resp = client.get("/")
    assert resp.status_code == 200
    assert resp.json() == {"service": "diviflow-api", "status": "ok"}


def test_healthz() -> None:
    """/healthz 返回 healthy"""
    client = TestClient(app)
    resp = client.get("/healthz")
    assert resp.status_code == 200
    assert resp.json() == {"status": "healthy"}
