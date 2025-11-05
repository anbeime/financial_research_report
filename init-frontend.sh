#!/bin/bash
# 初始化前端项目脚本

# 创建前端目录
mkdir -p frontend
cd frontend

# 使用 Vite 创建 React 项目
npm create vite@latest . -- --template react

# 安装依赖
npm install

# 安装额外的依赖
npm install axios react-router-dom @tanstack/react-query lucide-react

# 配置 API 代理 (可选，用于开发环境)
echo "前端项目初始化完成！"
