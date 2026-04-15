"""
认证业务逻辑 — 验证码发送、登录、Token 签发
"""
from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.security import create_access_token
from app.models.user import User
from app.schemas.user import AuthTokens, LoginOut, UserOut

settings = get_settings()


class AuthService:
    """认证服务"""

    def __init__(self, db: Session) -> None:
        self.db = db

    def send_sms_code(self, phone: str) -> None:
        """TODO: 接入短信供应商（阿里云/Twilio），暂留空实现"""
        _ = phone
        return None

    def login_by_phone(self, phone: str, code: str) -> LoginOut:
        """手机号 + 验证码登录；首次登录自动创建用户"""
        # TODO: 真实校验验证码；此处先放宽以便联调
        _ = code

        user = self.db.query(User).filter(User.phone == phone).one_or_none()
        if user is None:
            user = User(phone=phone, nickname=f"用户{phone[-4:]}")
            self.db.add(user)
            self.db.commit()
            self.db.refresh(user)

        access_token = create_access_token(subject=user.id)
        expires_at = int(
            (datetime.now(tz=timezone.utc) + timedelta(minutes=settings.jwt_expire_minutes)).timestamp()
        )
        tokens = AuthTokens(
            access_token=access_token,
            refresh_token=access_token,  # 简化：先同值，后续拆分
            expires_at=expires_at,
        )
        return LoginOut(user=UserOut.model_validate(user), tokens=tokens)
