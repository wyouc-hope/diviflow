"""
用户相关 Pydantic schema
"""
from datetime import datetime

from app.schemas.common import CamelBase


class UserOut(CamelBase):
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


class AuthTokens(CamelBase):
    """Token 对"""

    access_token: str
    refresh_token: str
    expires_at: int


class LoginByPhoneIn(CamelBase):
    """入参：手机号 + 验证码登录"""

    phone: str
    code: str


class LoginOut(CamelBase):
    """登录响应"""

    user: UserOut
    tokens: AuthTokens


class SendSmsCodeIn(CamelBase):
    """入参：发送短信验证码"""

    phone: str
