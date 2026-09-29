# MUI 官网视觉设计系统源码调研

> **主题：** mui.com 为什么比默认 Material UI 更“精致”  
> **调研日期：** 2026-09-29  
> **范围：** 官方 GitHub 源码、官方文档、历史 `brandingTheme`、当前 MUI Theme 实践

## 一、执行摘要

mui.com 的视觉差异并不是因为使用了另一套“隐藏组件库”，而是 MUI 团队在 Material UI 基础组件之上建立了品牌化 Theme 与组件级 overrides。

历史源码中，MUI 维护者明确指向 `docs/src/modules/brandingTheme.ts`；当前仓库则继续通过 `createTheme`、设计 token、color schemes 与 `components.styleOverrides / variants` 来实现统一视觉。[S1][S2][S3]

### 核心发现

- 按钮的“质感”主要来自：**轻微渐变 + inset 高光/暗部 + 边框 + 状态变化**，而不是单一 `box-shadow`。
- 输入框的“舒服”来自：**8px 圆角、统一 36/40px 高度、柔和边框、hover 变深、focus 3px ring**，以及移除默认 `notchedOutline` 边框。
- 圆角不是随意加大，而是 token 化；当前共享 Theme primitive 中 `shape.borderRadius = 8`。
- 现代 MUI 的推荐实现方式就是把全局视觉放到 `createTheme({ components })`，而不是在页面里到处写 `sx`。
- 历史 mui.com `brandingTheme` 与当前仓库代码存在演进差异，因此复刻时应提取**设计规律**，不要整份复制旧主题。

---

## 二、调研范围与证据等级

本报告把证据分为三类，以避免把“历史官网实现”“当前模板实现”和“官方 API 能力”混为一谈。

| 证据等级 | 来源 | 适用结论 |
| --- | --- | --- |
| A：直接官网证据 | MUI 维护者公开回答 + 历史 `brandingTheme.ts` | 可直接说明 mui.com 曾使用专门品牌主题 |
| B：当前官方仓库实现 | `master` 分支 `shared-theme / inputs / themePrimitives / surfaces` | 代表当前 MUI 团队仍在采用的现代 Theme 组织方式 |
| C：官方文档机制 | Theming / TextField customization / styling guidance | 用于确认这些做法是官方支持的稳定扩展机制 |

---

## 三、源码链路：mui.com 为什么不是“默认 MUI”

2021 年 GitHub Discussion 中，有开发者直接询问 mui.com 使用的 Theme。MUI 维护者 `mbrookes` 回答并指向 `docs/src/modules/brandingTheme.ts`。该历史文件在 `v5.15.8` 标签下仍可查看，规模为 1283 行。[S1][S4]

这说明一个关键事实：官网组件的视觉表现来自“Material UI 组件 + MUI 自己的品牌主题”，而不是 Material UI 默认主题本身。

```tsx
<ThemeProvider theme={brandingTheme}>
  <Button />
  <TextField />
  <Card />
</ThemeProvider>
```

今天的仓库结构已经演进。当前官方 Theme 指南把 Theme 定义为“设计 token + components 级别默认值/覆写”，并明确建议需要全局改变 Button、TextField 等外观时使用 `createTheme({ components })`。[S2][S3]

---

## 四、视觉系统架构拆解

```text
Material UI primitives
        ↓
Theme primitives / design tokens
palette · typography · shape · shadows
        ↓
components.styleOverrides / variants
        ↓
Button · Input · Card · Menu · Checkbox ...
        ↓
页面只组合组件，不重复写视觉规则
```

这套架构的价值在于：页面代码保持业务语义，视觉规则集中维护。圆角、交互速度、focus ring、border、surface、dark mode 都由 Theme 统一控制。

---

## 五、Button：质感从哪里来

当前官方 `shared-theme` 的 `inputsCustomizations` 中，`MuiButtonBase` 统一关闭 ripple，并设置约 `100ms` 的 transition 与 `3px` `focus-visible` outline；`MuiButton` 则把默认 `boxShadow` 清零、取消 uppercase，并采用 `theme.shape.borderRadius`。[S5]

```ts
MuiButtonBase: {
  defaultProps: {
    disableTouchRipple: true,
    disableRipple: true,
  },
  styleOverrides: {
    root: ({ theme }) => ({
      transition: 'all 100ms ease-in',
      '&:focus-visible': {
        outline: `3px solid ${alpha(theme.palette.primary.main, 0.5)}`,
        outlineOffset: '2px',
      },
    }),
  },
}
```

Contained Button 的关键不是“大阴影”，而是**表面材质**。当前源码的 primary contained 使用从 `gray[700]` 到 `gray[800]` 的纵向渐变，并叠加顶部与底部 inset shadow，同时加 `1px` 边框；hover 时反而移除渐变和 shadow，切到更直接的背景色。[S5]

```ts
backgroundImage: `linear-gradient(to bottom, ${gray[700]}, ${gray[800]})`,
boxShadow: `
  inset 0 1px 0 ${gray[600]},
  inset 0 -1px 0 1px hsl(220, 0%, 0%)
`,
border: `1px solid ${gray[700]}`,
```

这会产生轻微“上亮下暗”的实体厚度感。它不是传统 Material Design 的明显 elevation，而更接近现代 SaaS / 开发者工具常见的低对比度 surface。

Secondary contained（品牌色按钮）也采用相同结构：品牌色渐变 + 顶部 inset 高光 + 底部 inset 暗部 + 品牌边框。[S6]

```text
background-image: linear-gradient(to bottom, brand[400], brand[500])
box-shadow: inset top highlight + inset bottom shadow
border: 1px solid brand[500]
```

### Button 的视觉公式

```text
Gradient
+ inset top highlight
+ inset bottom shadow
+ subtle border
+ fast hover/focus state
= 更有“实体触感”的按钮
```

---

## 六、Outlined Input / TextField：为什么更舒服

当前源码对 `MuiOutlinedInput` 的处理非常清晰：把 input 本身 padding 设为 `0`，把布局 padding 放到 root；root 使用 Theme 圆角、`1px` divider border、背景色，并把默认 `notchedOutline` 的 border 直接移除。[S7]

```ts
MuiOutlinedInput: {
  styleOverrides: {
    input: {
      padding: 0,
    },
    root: ({ theme }) => ({
      padding: '8px 12px',
      borderRadius: theme.shape.borderRadius,
      border: `1px solid ${theme.palette.divider}`,
      backgroundColor: theme.palette.background.default,
      transition: 'border 120ms ease-in',

      '&:hover': {
        borderColor: gray[400],
      },

      '&.Mui-focused': {
        outline: `3px solid ${alpha(brand[500], 0.5)}`,
        borderColor: brand[400],
      },
    }),
    notchedOutline: {
      border: 'none',
    },
  },
}
```

这里有 5 个对观感影响很大的点：

1. **圆角来自统一 token**：当前 shared theme 的 `shape.borderRadius = 8`。
2. **高度比例稳定**：`36px`（small）与 `40px`（medium）被显式定义。
3. **默认边框很淡**：hover 只提高边框对比度，不做剧烈颜色跳变。
4. **focus ring 清晰但柔和**：`3px` 半透明品牌色 outline，同时边框变为 `brand[400]`。
5. **移除默认 fieldset 边框**：由 root 自己承担边框，视觉结构更可控。

因此，“输入框圆角舒服”并不是单独由 `8px` 决定，而是下面这些比例共同作用：

```text
8px radius
+ 40px control height
+ 12px horizontal padding
+ 1px subtle border
+ 3px focus ring
```

---

## 七、Design Tokens：颜色、圆角、字体、阴影

当前 `themePrimitives.ts` 明确维护 `brand` 与 `gray` 色阶。例如 `brand` 采用一整组 HSL 蓝色色阶，`gray` 也不是纯中性灰，而带约 `220°` 的冷色相。[S8]

这类“冷灰 + 品牌蓝”会比 `#ddd / #999 / #1976d2` 这种少量孤立颜色更容易形成统一的 SaaS 视觉。

| Token | 源码示例 | 视觉作用 | 建议落地 |
| --- | --- | --- | --- |
| `shape.borderRadius` | `8` | 统一 Button / Input / Card 基础圆角 | 业务组件从 token 引用，避免魔法数字 |
| `brand 50–900` | HSL 蓝色阶 | focus、边框、主操作、浅背景都有连续层级 | 至少维护 6–10 档品牌色 |
| `gray 50–900` | 带冷色相灰阶 | surface、divider、hover、文字分层 | 不要只用 `#fff/#eee/#999/#000` |
| `typography` | 当前 shared theme: Inter | 更偏产品 / SaaS 的文字气质 | 定义 400 / 500 / 600 等清晰字重层级 |
| `motion` | `100–120ms` | 高频控件响应快，不拖沓 | 控件交互通常使用 100–160ms |
| `focus ring` | `3px + 50% alpha` | 明确键盘焦点，同时不显生硬 | 统一 outline + offset 规则 |

### 字体需要注意版本差异

历史 mui.com 源码曾使用 IBM Plex Sans 等品牌字体；当前 shared-theme 示例源码使用 Inter。二者共同说明“字体也是 Theme 的一等公民”，但不能把某个历史字体当成今天 mui.com 全站唯一固定字体。[S4][S9]

---

## 八、Card / Paper：为什么整体不像默认 Material Design

当前 `surfacesCustomizations` 对 `MuiPaper` 默认 elevation 设为 `0`；`MuiCard` 也使用 border + surface background，并显式 `boxShadow: 'none'`。[S10]

```ts
MuiPaper: {
  defaultProps: {
    elevation: 0,
  },
},

MuiCard: {
  styleOverrides: {
    root: ({ theme }) => ({
      backgroundColor: gray[50],
      borderRadius: theme.shape.borderRadius,
      border: `1px solid ${theme.palette.divider}`,
      boxShadow: 'none',
    }),
  },
},
```

这意味着现代 MUI 示例更倾向“边框与表面层级”，而不是大量依赖 elevation。

这与按钮上的轻微 inset 材质形成互补：

- 大面积容器保持干净、平面；
- 小型可交互控件通过渐变、边框、hover/focus 状态提供触感。

---

## 九、默认 MUI vs. mui.com 风格：差异矩阵

| 维度 | 默认 / 常规用法 | 官网 / 品牌化做法 | 产生的视觉差异 |
| --- | --- | --- | --- |
| Button surface | 单色背景 + 默认 elevation | 渐变 / inset / 边框 / 定制 hover | 更像精密控件，而不是默认 Material 按钮 |
| Input border | 默认 OutlinedInput fieldset | root 自己画 border，`notchedOutline` 取消 | 边缘更干净，focus 更统一 |
| Focus | 组件默认 focus 行为 | `3px` 半透明品牌 ring + `2px` offset | 状态清晰且现代 |
| Radius | 默认 shape 或零散 `sx` | 全局 token + 组件复用 | 视觉一致，比例更稳定 |
| Motion | 默认过渡或组件自定 | `100–120ms` 高频微交互 | 响应快、无拖沓感 |
| Card / Paper | elevation 常被用作层级 | elevation 0 + border + surface | 更轻、更 SaaS 化 |
| Typography | Roboto / 默认 Material 气质 | 品牌字体或 Inter 等现代字体系统 | 整体气质显著改变 |

---

## 十、对业务项目的落地建议

不建议直接复制 1200+ 行历史 `brandingTheme`。更合理的是提取设计规律，并按当前 MUI 机制重建一套较小、可维护的 Theme。

### 推荐分层

1. **Token 层：`tokens.ts`**  
   定义 brand / gray 色阶、radius、spacing、typography、shadow、motion。

2. **组件层：`components/`**  
   拆分 `button.ts`、`input.ts`、`select.ts`、`checkbox.ts`、`card.ts`、`menu.ts`、`dialog.ts` 等。

3. **Theme 装配层：`theme.ts`**  
   使用 `createTheme({ colorSchemes, typography, shape, components })` 统一装配。

4. **页面层**  
   尽量只写组件组合与布局，避免为了“变漂亮”而反复写 `sx`。

5. **状态完整性**  
   保留 dark mode、focus-visible、disabled、error 等状态，不只还原静态截图。

### 推荐目录

```text
src/
└── theme/
    ├── tokens.ts
    ├── theme.ts
    └── components/
        ├── button.ts
        ├── input.ts
        ├── select.ts
        ├── checkbox.ts
        ├── card.ts
        ├── menu.ts
        └── dialog.ts
```

---

## 十一、建议复刻基线（非逐字复制源码）

下面是根据源码规律抽出的业务项目基线。它不是声称与 mui.com 每个像素完全一致，而是把最关键的视觉机制保留下来。

```ts
const theme = createTheme({
  shape: {
    borderRadius: 8,
  },

  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },

  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },

    MuiButton: {
      styleOverrides: {
        // gradient + inset + border + states
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        // 8px radius + 1px border + 3px focus ring
      },
    },

    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
    },
  },
});
```

---

## 十二、边界与注意事项

- 历史 `brandingTheme` 是明确的 mui.com 证据，但它对应旧版站点；当前站点结构持续演进。
- 当前 `shared-theme` 文件属于官方仓库中的现代模板 / 共享主题实现，可证明设计方法与具体 token，但不应把它等同于“当前 mui.com 每个页面唯一运行时 Theme”。
- 官网视觉还会叠加页面级 `styled / sx`、布局、字体加载、浏览器渲染与具体组件组合，因此 Theme 不是全部。
- 复刻时应先定产品目标：如果业务是后台系统，过度复制官网 marketing / documentation 风格可能影响信息密度。

---

## 十三、最终结论

mui.com 看起来比“普通 MUI”更精致，核心不是换了组件库，而是把 MUI 当作行为与无障碍基础，在其上重新定义了：

```text
surface
+ states
+ radius
+ color scale
+ typography
+ motion
```

真正值得复制的是 Theme 架构与视觉规律：

- 低对比度层级；
- 连续色阶；
- 统一 radius；
- 快速微交互；
- 明确 focus；
- 适度使用 gradient / inset 产生触感。

如果下一阶段要做工程落地，最有价值的产物不是继续收集截图，而是基于本报告生成一套可直接运行的 React + MUI Theme，包括 Button、OutlinedInput、Select、Checkbox、Card、Menu、Dialog 的 light / dark 两套 overrides，并建立 Storybook / 示例页做视觉验收。

---

## 附录 A：主要源码与文档来源

- **[S1] GitHub Discussion #29235：维护者指向 mui.com 的 `brandingTheme.ts`**  
  <https://github.com/mui/material-ui/discussions/29235>

- **[S2] Material UI Theming 官方文档源码**  
  <https://github.com/mui/material-ui/blob/master/docs/data/material/customization/theming/theming.md>

- **[S3] Material UI Styling guidance：`createTheme({ components })`**  
  <https://github.com/mui/material-ui/blob/master/skills/material-ui-styling/AGENTS.md>

- **[S4] 历史 `brandingTheme.ts`（v5.15.8，1283 行）**  
  <https://github.com/mui/material-ui/blob/v5.15.8/docs/src/modules/brandingTheme.ts>

- **[S5] 当前 shared-theme / `inputs.tsx`：ButtonBase 与 primary Button**  
  <https://github.com/mui/material-ui/blob/master/docs/data/material/getting-started/templates/shared-theme/customizations/inputs.tsx>

- **[S6] 当前 shared-theme / `inputs.tsx`：secondary contained / outlined Button**  
  <https://github.com/mui/material-ui/blob/master/docs/data/material/getting-started/templates/shared-theme/customizations/inputs.tsx>

- **[S7] 当前 shared-theme / `inputs.tsx`：`MuiOutlinedInput`**  
  <https://github.com/mui/material-ui/blob/master/docs/data/material/getting-started/templates/shared-theme/customizations/inputs.tsx>

- **[S8] 当前 shared-theme / `themePrimitives.ts`：brand / gray 色阶**  
  <https://github.com/mui/material-ui/blob/master/docs/data/material/getting-started/templates/shared-theme/themePrimitives.ts>

- **[S9] 当前 shared-theme / `themePrimitives.ts`：typography / shape**  
  <https://github.com/mui/material-ui/blob/master/docs/data/material/getting-started/templates/shared-theme/themePrimitives.ts>

- **[S10] 当前 shared-theme / `surfaces.ts`：Paper / Card**  
  <https://github.com/mui/material-ui/blob/master/docs/data/material/getting-started/templates/shared-theme/customizations/surfaces.ts>

- **[S11] TextField 官方文档：`styleOverrides / styled API`**  
  <https://github.com/mui/material-ui/blob/master/docs/data/material/components/text-fields/text-fields.md>

- **[S12] `AppTheme.tsx`：当前官方模板如何组合 tokens 与 component customizations**  
  <https://github.com/mui/material-ui/blob/master/docs/data/material/getting-started/templates/shared-theme/AppTheme.tsx>

> **版本说明：** 源码链接与结论按 2026-09-29 可访问内容整理。历史源码与当前 `master` 分支分别标注，避免版本混淆。
