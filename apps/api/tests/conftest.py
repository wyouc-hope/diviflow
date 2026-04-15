"""
pytest 公共配置 — 使用内存 SQLite 并在所有用例前建表
"""
import os
from collections.abc import Iterator

import pytest

# 覆盖为内存库，避免污染本地文件
os.environ.setdefault("DATABASE_URL", "sqlite:///./test.db")

from app.core.database import Base, engine  # noqa: E402


@pytest.fixture(autouse=True, scope="session")
def _setup_db() -> Iterator[None]:
    """整个 session 只建一次表"""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)
