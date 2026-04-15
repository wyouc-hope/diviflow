# DiviFlow · 息流

> 面向分红投资者的个人工具 App — 让「用分红覆盖生活支出」的财务自由进度一目了然。

**仓库地址**：https://github.com/wyouc-hope/diviflow

## 仓库结构（Monorepo）

- `apps/mobile` — React Native + Expo + TypeScript 移动端
- `apps/api` — FastAPI (Python 3.11+) 后端
- `docs/prototype` — 高保真交互原型（单文件 HTML，17+ 页）

## 端到端联调（第一条链路）

目标：**后端起服务 → 手机打开 App → 手机号登录 → 看板显示空组合**。

### 1. 启动后端

```bash
cd apps/api
python -m venv .venv && source .venv/bin/activate   # Windows 用 .venv\Scripts\activate
pip install -e ".[dev]"
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

启动成功后：
- 健康检查：`curl http://localhost:8000/healthz` → `{"status":"healthy"}`
- Swagger 文档：浏览器打开 `http://localhost:8000/docs`
- `--host 0.0.0.0` 确保真机通过局域网 IP 也能访问（只用 `localhost` 的话真机连不上）

### 2. 配置并启动移动端

```bash
cd apps/mobile
cp .env.example .env     # 按注释选一个合适的 API 地址
npm install              # 首次运行需要
npm run mobile           # 启动 Expo dev server
```

`.env` 里的 `EXPO_PUBLIC_API_BASE_URL` 按场景选：
- **iOS 模拟器**：`http://localhost:8000`
- **Android 模拟器**：`http://10.0.2.2:8000`
- **真机（Expo Go）**：PC 的局域网 IP，例如 `http://192.168.1.50:8000`，PC 和手机需在同一 Wi-Fi

按 `i` 开 iOS 模拟器，`a` 开 Android 模拟器，或用手机扫描二维码打开 Expo Go。

### 3. 验证登录链路

1. 打开 App，进入登录页
2. 输入任意 11 位手机号（如 `13800000000`），任意 4-6 位验证码
3. 点击「登录」→ 自动跳到 Tabs，首页显示：
   - 昵称「用户0000」（取手机号末 4 位）
   - 组合市值 `CNY 0.00`
   - 提示「组合为空 · 点击「+ 添加持仓」开始记录」

> 当前验证码**不做校验**（便于联调），后续会接入短信服务。

## 常用命令

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

## 原型预览

直接用浏览器打开 `docs/prototype/diviflow_interactive_1.html` 即可预览全部屏幕。

## 文档

- [`CLAUDE.md`](./CLAUDE.md) — 项目背景、技术栈、目录说明、编码偏好（AI 协作上下文）

## 开发规范

- **提交**：Conventional Commits（`feat(mobile): ...` / `fix(api): ...`）
- **TypeScript**：严格模式 + ESLint + Prettier
- **Python**：Ruff + Black + MyPy strict
- **命名**：组件/函数 camelCase，文件 kebab-case（前端）/ snake_case（后端）
- **API 字段**：出入参统一 camelCase（后端 schema 继承 `CamelBase` 自动转换）
- **注释 & 文档**：使用中文

## License

暂定 Private（个人项目）
