"""
DiviFlow API 入口

启动方式：
    uvicorn app.main:app --reload
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="DiviFlow API",
    description="息流 · 分红投资者工具 — 后端 API",
    version="0.1.0",
)

# CORS 配置（开发环境允许本地移动端调用）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root() -> dict[str, str]:
    """根路径：健康检查"""
    return {"service": "diviflow-api", "status": "ok"}


@app.get("/healthz")
def healthz() -> dict[str, str]:
    """K8s 风格健康探针"""
    return {"status": "healthy"}
