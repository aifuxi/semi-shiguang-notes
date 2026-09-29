# Repository Guidelines

## 项目结构

- `src/`：React + TypeScript 应用入口、共享类型、模拟数据和页面组件；`src/components/` 按功能划分管理后台与读者端界面。
- `src/index.css`：全局样式；`index.html`：Vite 页面入口。
- `assets/`：静态资源；`docs/`：项目调研文档。
- 根目录配置包括 `vite.config.ts`、`tsconfig.json` 和 `package.json`。

## 开发、构建与检查

- `npm ci`：按锁文件安装依赖。
- `npm run dev`：启动本地 Vite 开发服务器（端口 `6121`）。
- `npm run build`：生成生产构建到 `dist/`。
- `npm run preview`：本地预览生产构建。
- `npm run lint`：运行 `tsc --noEmit` 类型检查；此仓库未配置独立测试脚本或测试框架。

## 代码风格与命名

使用 TypeScript、React 函数组件和 JSX；沿用相邻文件的格式与导入习惯，缩进保持一致。组件文件使用 PascalCase（如 `ContentManagement.tsx`），工具、数据和样式文件使用 camelCase 或既有名称。共享数据结构放在 `src/types.ts`，演示数据放在 `src/mockData.ts`。界面文案以中文为主；沿用 Semi UI 组件及 `src/index.css` 中定义的原生 CSS 工具类（如 `flex`、`gap-3`），避免无关的大范围重排。

## 测试与验证

目前没有自动化测试。提交前至少运行 `npm run lint` 和 `npm run build`；涉及交互或布局的改动，还应通过 `npm run dev` 手动检查相关页面及窄屏布局。新增测试时，按对应组件或功能命名，并补充可重复运行的脚本。

## 提交与 Pull Request

提交信息遵循 Conventional Commits，类型后使用中文概述，例如 `feat: 新增访客日志筛选`、`fix: 修复暗色主题切换`。PR 请说明改动目的、主要变更和验证命令；界面改动附前后对比截图，关联相关 issue（如有），并注明尚未覆盖的验证项。

## 配置与本地数据

不要提交密钥或个人配置；本地环境文件已由 `.gitignore` 排除，如需示例配置请使用 `.env.example`。当前演示状态保存在浏览器 `localStorage`，验证持久化逻辑时注意使用对应浏览器数据。
