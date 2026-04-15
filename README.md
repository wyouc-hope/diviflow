# DiviFlow · 息流

> 面向分红投资者的个人工具 App — 让「用分红覆盖生活支出」的财务自由进度一目了然。

**仓库地址**：https://github.com/wyouc-hope/diviflow

## 仓库结构（Monorepo）

- `apps/mobile` — React Native + Expo + TypeScript 移动端
- `apps/api` — FastAPI (Python 3.11+) 后端
- `docs/prototype` — 高保真交互原型（单文件 HTML，17+ 页）

## 快速开始

### 前置要求

- Node.js >= 20
- Python >= 3.11
- iOS / Android 模拟器或 Expo Go App（真机调试）

### 移动端

```bash
npm install
npm run mobile           # 启动 Expo dev server
npm run mobile:ios       # 直接唤起 iOS 模拟器
npm run mobile:android   # 直接唤起 Android 模拟器
```

### 后端

```bash
cd apps/api
python -m venv .venv && source .venv/bin/activate
pip install -e ".[dev]"
uvicorn app.main:app --reload
# 访问 http://localhost:8000/docs 查看 Swagger
```

## 原型预览

直接用浏览器打开 `docs/prototype/diviflow_interactive_1.html` 即可预览全部屏幕。

## 文档

- [`CLAUDE.md`](./CLAUDE.md) — 项目背景、技术栈、目录说明、编码偏好（AI 协作上下文）

## 开发规范

- **提交**：Conventional Commits（`feat(mobile): ...` / `fix(api): ...`）
- **TypeScript**：严格模式 + ESLint + Prettier
- **Python**：Ruff + Black + MyPy strict
- **命名**：组件/函数 camelCase，文件 kebab-case（前端）/ snake_case（后端）
- **注释 & 文档**：使用中文

## License

暂定 Private（个人项目）
