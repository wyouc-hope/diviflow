"""
用户相关 Pydantic schema
"""
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class UserOut(BaseModel):
    """出参：用户基础信息"""

    id: str
    phone: str | None = None
    email: str | None = None
    nickname: str
    avatar_url: str | None = None
    region: str
    base_currency: str
    monthly_expense_target: float
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AuthTokens(BaseModel):
    """Token 对"""

    access_token: str
    refresh_token: str
    expires_at: int


class LoginByPhoneIn(BaseModel):
    """入参：手机号 + 验证码登录"""

    phone: str
    code: str


class LoginOut(BaseModel):
    """登录响应"""

    user: UserOut
    tokens: AuthTokens


class SendSmsCodeIn(BaseModel):
    """入参：发送短信验证码"""

    phone: str
