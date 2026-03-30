# Claude Code 项目规范

## 语言与交互偏好
- **首选语言**: 始终使用 **中文 (简体)** 进行对话、解释代码、撰写注释和 Commit Message。
- **回复风格**: 简洁、专业、以结果为导向。在执行复杂操作前，先用中文简述你的计划。

## 技术规范
- **框架**: Next.js (App Router), Tailwind CSS, Prisma (基于 PRD 设定)
- **命名规范**: 变量和函数使用英文（驼峰式），但代码注释必须包含中文说明。
- **提交准则**: 使用中文撰写 Git Commit Message，格式为 `类型: 描述` (例如 `feat: 实现用户登录接口`)。

## 核心参考
- 项目逻辑必须严格遵守根目录下的 `PRD.md`。
- UI 布局必须参考 `docs/ui-spec.md` 中的描述。

## 常用命令
- 测试: `npm test`
- 开发: `npm run dev`
- 构建: `npm run build`