"""
认证路由
"""
from fastapi import APIRouter

from app.core.deps import DbSession
from app.schemas.user import LoginByPhoneIn, LoginOut, SendSmsCodeIn
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/sms-code")
def send_sms_code(payload: SendSmsCodeIn, db: DbSession) -> dict[str, bool]:
    """发送短信验证码"""
    AuthService(db).send_sms_code(payload.phone)
    return {"ok": True}


@router.post("/login", response_model=LoginOut)
def login(payload: LoginByPhoneIn, db: DbSession) -> LoginOut:
    """手机号 + 验证码登录"""
    return AuthService(db).login_by_phone(payload.phone, payload.code)


@router.post("/logout")
def logout() -> dict[str, bool]:
    """登出（当前无服务端状态，客户端丢弃 Token 即可）"""
    return {"ok": True}
