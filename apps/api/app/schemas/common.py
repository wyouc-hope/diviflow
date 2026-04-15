"""
通用 schema — 驼峰基类 + 分页等
"""
from typing import Generic, TypeVar

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

T = TypeVar("T")


class CamelBase(BaseModel):
    """
    全部出入参的基类：
    - 字段按 Python 约定用 snake_case 定义
    - 序列化到 JSON 时自动转为 camelCase，匹配前端 TS 类型
    - 同时允许 from_attributes（SQLAlchemy ORM 自动映射）
    - populate_by_name 允许反序列化时既接受 camelCase 也接受 snake_case
    """

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )


class Paginated(CamelBase, Generic[T]):
    """统一分页响应（items / page / pageSize / total）"""

    items: list[T]
    page: int
    page_size: int
    total: int
