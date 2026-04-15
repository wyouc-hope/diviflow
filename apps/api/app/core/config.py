"""
应用配置 — 基于 Pydantic Settings，从环境变量加载。
"""
from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """全局配置项（.env 驱动）"""

    app_env: str = Field(default="development")
    app_port: int = Field(default=8000)
    app_secret_key: str = Field(default="change-me-in-production")

    # 数据库
    database_url: str = Field(default="sqlite:///./diviflow.db")

    # JWT
    jwt_secret: str = Field(default="change-me")
    jwt_algorithm: str = Field(default="HS256")
    jwt_expire_minutes: int = Field(default=60)

    # 外部服务
    market_data_api_key: str = Field(default="")
    openai_api_key: str = Field(default="")

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )


@lru_cache
def get_settings() -> Settings:
    """依赖注入入口 — 单例配置"""
    return Settings()
