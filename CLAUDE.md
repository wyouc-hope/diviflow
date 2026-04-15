# CLAUDE.md

> 本文件用于 Claude（或其他 AI 协作代理）在任何设备上恢复本项目上下文。
> 请在每次开始工作前先阅读本文件，遵循其中的语言偏好、技术选型、目录结构与编码规范。

---

## 0. 语言与交互偏好（最高优先级）

- **首选语言**：始终使用 **中文（简体）** 进行对话、解释代码、撰写注释和 Commit Message。
- **回复风格**：简洁、专业、以结果为导向。在执行复杂操作前，先用中文简述计划。
- **沟通节奏**：拿不准的关键决策（技术选型、外部依赖、删除/迁移）必须先确认再动手。

---

## 1. 项目背景

**项目名称**：DiviFlow · 息流
**项目定位**：面向分红（Dividend）投资者的个人工具类 App
**核心价值**：让持有分红股的投资者直观地看到「用分红覆盖生活支出」的财务自由进度
**仓库地址**：https://github.com/wyouc-hope/diviflow

### 核心功能（依据交互原型梳理）

- **启动 / 登录 / 注册**：手机号、微信、苹果一键登录
- **Onboarding**：地区（决定税率/汇率/数据源）→ 当前资产 → 月支出目标
- **主看板 Home**：实时价格、组合概览、快捷操作
- **添加持仓**：Bottom Sheet 表单 + ✨ AI 扫描截图（上传→识别→确认）
- **股票搜索**：支持模糊匹配与常见市场
- **持仓列表**：全量持仓、收益总览、快速编辑
- **财务自由追踪**：分红覆盖生活进度、里程碑、加速路径
- **分红日历**：登记日、除权除息日、派息到账提醒
- **消息通知**：到账高情绪推送、减息预警、打卡
- **成就打卡**：持股热力图、徽章、分享海报
- **发现工具**：个股档案、高息筛选、DRIP 模拟、税后计算
- **设置 / 我的**：账户、数据配置、通知偏好

### 核心参考文件

- 高保真原型：`docs/prototype/diviflow_interactive_1.html`（直接用浏览器打开浏览 17+ 页面）
- 产品逻辑（待补充）：根目录 `PRD.md`
- UI 视觉规范（待补充）：`docs/ui-spec.md`

---

## 2. 技术栈

### 前端（移动端）

- **框架**：React Native + Expo (SDK 52+)
- **语言**：TypeScript（严格模式，禁用 `any` 兜底）
- **路由**：expo-router（基于文件系统）
- **状态管理**：待定（倾向 Zustand 或 Jotai，轻量优先）
- **样式**：React Native StyleSheet（主题色板见 `apps/mobile/src/theme/colors.ts`）
- **Lint / Format**：ESLint + Prettier

### 后端

- **框架**：FastAPI（Python 3.11+）
- **ORM**：SQLAlchemy 2.0 + Alembic（迁移）
- **校验**：Pydantic v2
- **HTTP 客户端**：httpx
- **认证**：JWT（python-jose）+ passlib（密码哈希）
- **Lint / Format**：Ruff + Black + MyPy
- **测试**：pytest + pytest-asyncio

### 基础设施

- **仓库形态**：Monorepo（npm workspaces 管理前端；后端独立 Python 虚拟环境）
- **Node 版本**：>=20
- **Python 版本**：>=3.11

---

## 3. 目录结构

```
diviflow/
├── CLAUDE.md                   # 本文件：项目上下文与协作规范
├── README.md                   # 项目简介与快速上手
├── .gitignore                  # 忽略规则（Node + Python + Expo + IDE）
├── package.json                # Monorepo 根（workspaces 定义 + 快捷脚本）
│
├── apps/
│   ├── mobile/                 # React Native + Expo 移动端
│   │   ├── app.json            # Expo 配置（App 名称、Bundle ID 等）
│   │   ├── package.json        # 移动端依赖
│   │   ├── tsconfig.json       # TS 严格模式 + 路径别名 (@/ @screens/ ...)
│   │   ├── .eslintrc.js
│   │   ├── .prettierrc.json
│   │   ├── .env.example        # 环境变量模板
│   │   ├── assets/             # 图片、字体等静态资源
│   │   └── src/
│   │       ├── screens/        # 页面（对应原型 17+ 屏）
│   │       ├── components/     # 可复用 UI 组件
│   │       ├── navigation/     # 路由/Tab 配置
│   │       ├── services/       # API 客户端、第三方 SDK 封装
│   │       ├── stores/         # 全局状态
│   │       ├── hooks/          # 自定义 Hooks
│   │       ├── utils/          # 纯函数工具
│   │       ├── types/          # 全局类型定义
│   │       └── theme/          # 设计令牌（颜色、间距、字体）
│   │
│   └── api/                    # FastAPI 后端
│       ├── pyproject.toml      # 依赖 + Ruff/Black/MyPy/pytest 配置
│       ├── requirements.txt
│       ├── .env.example
│       ├── app/
│       │   ├── main.py         # FastAPI 入口
│       │   ├── routers/        # 路由（按业务域拆分：auth, holdings, dividends ...）
│       │   ├── models/         # SQLAlchemy ORM 模型
│       │   ├── schemas/        # Pydantic 请求/响应模型
│       │   ├── services/       # 业务逻辑层
│       │   └── core/           # 配置、安全、依赖注入
│       └── tests/              # pytest 测试
│
└── docs/
    └── prototype/
        └── diviflow_interactive_1.html   # 高保真交互原型（单文件 HTML）
```

> 工作目录在本机可能名为 `息流diviflow/`，仓库名以 GitHub 上的 `diviflow` 为准。

---

## 4. 编码偏好

### TypeScript / JavaScript

- **严格模式**：`tsconfig.json` 开启 `strict: true`，禁止 `any` 兜底（必要时显式注释）
- **Lint**：ESLint + `@typescript-eslint`；CI 和提交前必须通过
- **Format**：Prettier；使用单引号、分号、尾逗号 `all`、行宽 100
- **命名**：
  - 变量 / 函数 / Hook：**驼峰（camelCase）**，如 `useHoldingStore`、`formatCurrency`
  - React 组件：大驼峰（PascalCase），如 `HoldingCard`
  - 文件名：**kebab-case**，如 `holding-card.tsx`、`use-dividend-calendar.ts`
  - 常量：UPPER_SNAKE_CASE，如 `DEFAULT_CURRENCY`
- **目录导入**：使用路径别名 `@/`、`@screens/`、`@components/` 等（见 `tsconfig.json`）

### Python

- **格式**：Black（行宽 100）
- **Lint**：Ruff（E/F/W/I/N/UP/B/A/C4/SIM）
- **类型**：MyPy `strict` 模式，函数签名必须标注类型
- **命名**：模块/函数 `snake_case`，类 `PascalCase`，常量 `UPPER_SNAKE_CASE`
- **文件名**：`snake_case.py`（Python 社区惯例，区别于前端 kebab-case）

### 注释与文档

- **语言**：代码注释、README、CLAUDE.md、PR/Issue 描述 **一律使用中文**
- 函数/模块顶部写一行中文 docstring 说明意图；复杂逻辑再展开
- 面向用户的字符串可中英混排（App 目前以中文为主）

### Git 提交规范（Conventional Commits + 中文描述）

格式：`<type>(<scope>): <中文描述>`

- **type**：`feat` · `fix` · `docs` · `style` · `refactor` · `perf` · `test` · `build` · `ci` · `chore` · `revert`
- **scope**（可选）：`mobile` · `api` · `docs` · `infra` · 某个具体模块
- **subject**：中文祈使句，不超过 50 字

示例：
- `feat(mobile): 实现用户登录接口`
- `feat(mobile): 新增分红日历 Tab`
- `fix(api): 修正除权日时区偏移导致的提醒误报`
- `docs: 补充 Onboarding 流程原型说明`
- `chore: 初始化项目结构与基础配置`

---

## 5. 协作流程建议

1. **开始工作前**：先 `git pull`，阅读本文件确认上下文
2. **分支策略**（暂定 trunk-based）：
   - `main`：受保护，始终可部署
   - `feature/<短名>`：功能开发
   - `fix/<短名>`：Bug 修复
3. **提交前**：
   - 前端：`npm run -w apps/mobile lint && npm run -w apps/mobile type-check`
   - 后端：`ruff check apps/api && mypy apps/api/app && pytest apps/api/tests`
4. **PR 描述**：中文说明动机、改动点、截图（如有 UI 改动）、测试方法

---

## 6. 常用命令

| 场景 | 命令 |
| --- | --- |
| 启动移动端 dev server | `npm run mobile` |
| iOS 模拟器 | `npm run mobile:ios` |
| Android 模拟器 | `npm run mobile:android` |
| 移动端 Lint | `npm run -w apps/mobile lint` |
| 移动端类型检查 | `npm run -w apps/mobile type-check` |
| 启动后端 | `cd apps/api && uvicorn app.main:app --reload` |
| 后端测试 | `cd apps/api && pytest` |
| 后端 Lint + 类型 | `cd apps/api && ruff check . && mypy app` |

---

## 7. 路线图（Roadmap — 高层次）

- **M0**（当前）：工程初始化、原型归档、CLAUDE.md 落地 ✅
- **M1**：搭建 Expo 基础壳 + 底 Tab + Home 骨架；FastAPI 起 `/auth` 与 `/holdings` CRUD
- **M2**：打通前后端：登录 → 添加持仓 → 主看板展示
- **M3**：分红日历 + 消息通知 + FI 进度
- **M4**：AI 扫描截图识别持仓（OCR + 结构化）
- **M5**：发现工具（DRIP、税后计算）+ 成就打卡

---

## 8. Claude 工作提示

- 修改前端 UI 前请参考 `docs/prototype/diviflow_interactive_1.html` 的视觉与交互
- 新增页面先在 `apps/mobile/src/screens/` 下建文件，再接入 `navigation/`
- 新增后端业务先走 `schemas → models → services → routers` 的顺序
- 敏感信息（API Key、Token）**永远**不要提交到仓库，全部走 `.env`
- 涉及金融计算（分红税后、汇率换算）必须写单元测试
- 如出现 `PRD.md` 与本文件冲突，以 `PRD.md` 的产品逻辑为准；技术选型与编码规范以本文件为准

_本文件持续演进，重大变更请同步更新并在提交说明中标注。_
