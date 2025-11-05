#!/bin/bash
# Cloudflare Pages 构建脚本

set -e

echo "================================"
echo "构建 React 前端应用"
echo "================================"

# 进入前端目录
cd frontend

# 安装依赖
echo "📦 安装前端依赖..."
npm install

# 构建应用
echo "🔨 构建应用..."
npm run build

# 检查输出目录
if [ ! -d "dist" ]; then
  echo "❌ 构建失败：找不到 dist 目录"
  exit 1
fi

echo "✓ 构建完成！"
echo "📁 输出目录: frontend/dist"
