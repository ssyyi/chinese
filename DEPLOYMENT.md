# 部署指南 - Deployment Guide

## 部署到 Vercel（推荐）

### 1. 准备工作

确保项目已经推送到 Git 仓库（GitHub, GitLab 或 Bitbucket）

### 2. 部署步骤

1. 访问 [Vercel](https://vercel.com)
2. 使用 Git 账号登录
3. 点击 "New Project"
4. 导入你的 Git 仓库
5. Vercel 会自动检测 Next.js 项目
6. 点击 "Deploy" 开始部署

### 3. 环境变量（如需要）

当前项目不需要设置环境变量

---

## 部署到 Netlify

### 1. 构建设置

```
Build command: npm run build
Publish directory: .next
```

### 2. 部署步骤

1. 访问 [Netlify](https://www.netlify.com)
2. 连接 Git 仓库
3. 配置构建设置
4. 点击 "Deploy site"

---

## 使用 Nginx 部署

### 1. 构建生产版本

```bash
npm run build
```

### 2. 启动 Next.js 服务器

```bash
npm start
```

默认运行在 `http://localhost:3000`

### 3. 配置 Nginx

创建 Nginx 配置文件：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 4. 使用 PM2 管理进程（推荐）

安装 PM2：

```bash
npm install -g pm2
```

启动应用：

```bash
pm2 start npm --name "hanzi-app" -- start
pm2 save
pm2 startup
```

---

## Docker 部署

### 1. 创建 Dockerfile

```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["npm", "start"]
```

### 2. 创建 docker-compose.yml

```yaml
version: '3.8'
services:
  hanzi-app:
    build: .
    ports:
      - "3000:3000"
    restart: unless-stopped
```

### 3. 构建并运行

```bash
docker-compose up -d
```

---

## 性能优化建议

### 1. 启用压缩

在 `next.config.ts` 中：

```typescript
const config: NextConfig = {
  compress: true,
};
```

### 2. 图片优化

使用 Next.js Image 组件（如有图片）

### 3. 字体优化

已使用 Google Fonts 优化加载

### 4. CDN 缓存

配置静态资源缓存策略

---

## 常见问题

### Q: 部署后页面显示 404？

A: 确保构建成功且所有依赖都已安装

### Q: 样式未加载？

A: 检查 Tailwind CSS 配置是否正确

### Q: 汉字无法显示？

A: 确保 hanzi-writer-data 包已正确安装

---

## 监控和日志

### 使用 Vercel Analytics

在 `package.json` 中添加：

```bash
npm install @vercel/analytics
```

在 `app/layout.tsx` 中：

```typescript
import { Analytics } from '@vercel/analytics/react';

// 在返回的 JSX 中添加
<Analytics />
```

---

## 更多帮助

- [Next.js 部署文档](https://nextjs.org/docs/deployment)
- [Vercel 文档](https://vercel.com/docs)
- [Netlify 文档](https://docs.netlify.com/)
