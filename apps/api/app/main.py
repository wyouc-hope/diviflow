"""
DiviFlow API 入口

启动方式：
    uvicorn app.main:app --reload
"""
from contextlib import asynccontextmanager
from collections.abc import AsyncIterator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import Base, engine
from app.models import DividendEvent, Holding, User  # noqa: F401 — 触发模型注册
from app.routers import auth, dividends, holdings


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    """应用生命周期：启动时建表（TODO: 生产环境改用 Alembic 迁移）"""
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="DiviFlow API",
    description="息流 · 分红投资者工具 — 后端 API",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS 配置（开发环境允许本地移动端调用）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册业务路由
app.include_router(auth.router)
app.include_router(holdings.router)
app.include_router(dividends.router)


@app.get("/")
def root() -> dict[str, str]:
    """根路径：健康检查"""
    return {"service": "diviflow-api", "status": "ok"}


@app.get("/healthz")
def healthz() -> dict[str, str]:
    """K8s 风格健康探针"""
    return {"status": "healthy"}
