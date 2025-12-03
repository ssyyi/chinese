# 汉字书写练习 - Chinese Character Writing Practice


在线地址：[https://chinese-rosy.vercel.app/](https://chinese-rosy.vercel.app/)


一个现代化、交互式的汉字书写练习应用，使用 Next.js 和 hanzi-writer 构建。

## ✨ 功能特性

- 🎨 **笔顺动画**：观看正确的汉字书写顺序，学习标准笔画
- ✍️ **互动练习**：跟随提示描写汉字，实时反馈练习效果
- 🔍 **汉字搜索**：搜索任意汉字进行练习
- 📚 **常用汉字**：预设24个简单常用汉字供初学者练习
- 📱 **移动适配**：完美支持手机和平板，随时随地练习
- 🎭 **精美UI**：采用玻璃态设计、渐变动画和现代配色

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 运行开发服务器

```bash
npm run dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
npm run build
npm start
```

## 📖 使用说明

### 选择汉字

1. **从常用汉字列表中选择**：点击右侧网格中的任意汉字
2. **搜索自定义汉字**：在顶部搜索框输入想要练习的汉字

### 练习功能

- **笔顺动画**：观看正确的书写顺序和笔画方向
- **开始练习**：进入互动模式，跟随提示描写汉字
- **重置**：清除当前显示，重新开始

### 移动端使用

- 应用完全响应式设计，支持触摸操作
- 可以在手机或平板上使用手指或手写笔进行练习

## 🛠 技术栈

- **框架**：Next.js 16 (App Router)
- **UI**：React + TypeScript
- **样式**：Tailwind CSS v4
- **汉字库**：hanzi-writer + hanzi-writer-data
- **字体**：Noto Sans SC, Inter

## 📁 项目结构

```
├── app/
│   ├── globals.css      # 全局样式和设计系统
│   ├── layout.tsx       # 根布局
│   └── page.tsx         # 主页面
├── components/
│   └── HanziWriter.tsx  # 汉字书写组件
└── public/              # 静态资源
```

## 🎨 设计特性

- **玻璃态效果 (Glassmorphism)**：半透明背景，模糊效果
- **动态渐变**：文字和背景的流动渐变动画
- **悬浮动画**：微妙的浮动效果增加互动感
- **暗黑主题**：护眼的深色配色方案
- **自定义滚动条**：符合整体设计风格

## 📝 默认汉字列表

应用预设了24个常用简单汉字：

```
一 二 三 人 大 天 日 月
水 火 木 土 山 石 田 力
手 足 目 口 心 门 们 你
```

## 🔧 开发说明

### 添加更多汉字

编辑 `app/page.tsx` 中的 `DEFAULT_CHARACTERS` 数组：

```typescript
const DEFAULT_CHARACTERS = [
  '一', '二', '三', // 添加更多汉字...
];
```

### 自定义样式

所有设计令牌定义在 `app/globals.css` 的 `:root` 中：

```css
:root {
  --primary: 238 82% 60%;
  --secondary: 280 70% 65%;
  /* 修改这些值来改变配色... */
}
```

### 调整汉字显示大小

在 `app/page.tsx` 中修改 HanziWriter 组件的 size 属性：

```tsx
<HanziWriterComponent character={selectedChar} size={300} />
```

## 🌐 浏览器支持

- Chrome/Edge (推荐)
- Firefox
- Safari
- 移动浏览器

## 📄 许可证

MIT

## 🙏 致谢

- [hanzi-writer](https://github.com/chanind/hanzi-writer) - 优秀的汉字书写库
- [hanzi-writer-data](https://github.com/chanind/hanzi-writer-data) - 汉字笔画数据
