"""
数据库连接与 Session 管理
"""
from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.core.config import get_settings

settings = get_settings()

# SQLite 需要 check_same_thread=False，Postgres 等忽略此参数
connect_args = (
    {"check_same_thread": False} if settings.database_url.startswith("sqlite") else {}
)

engine = create_engine(
    settings.database_url,
    connect_args=connect_args,
    echo=settings.app_env == "development",
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    """所有 ORM 模型的声明式基类"""


def get_db() -> Generator[Session, None, None]:
    """FastAPI 依赖：每个请求一个 Session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
