#!/bin/bash
# 启动脚本 - 同时启动后端和前端

set -e

echo "================================"
echo "金融研报生成系统 - 完整启动"
echo "================================"

# 检查 Python 版本
echo "✓ 检查 Python 版本..."
python --version || { echo "❌ 需要安装 Python 3.8+"; exit 1; }

# 检查 Node.js 版本
echo "✓ 检查 Node.js 版本..."
node --version || { echo "❌ 需要安装 Node.js 16+"; exit 1; }

# 创建 Python 虚拟环境（如果不存在）
if [ ! -d "venv" ]; then
    echo "📦 创建 Python 虚拟环境..."
    python -m venv venv
fi

# 激活虚拟环境
echo "✓ 激活虚拟环境..."
source venv/bin/activate

# 安装 Python 依赖
echo "📦 安装 Python 依赖..."
pip install -q -r requirements.txt

# 启动后端服务
echo ""
echo "🚀 启动后端服务（FastAPI）..."
echo "后端地址：http://localhost:8000"
echo "API 文档：http://localhost:8000/docs"
python app.py &
BACKEND_PID=$!

# 等待后端启动
sleep 3

# 安装前端依赖
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 安装前端依赖..."
    cd frontend
    npm install -q
    cd ..
fi

# 启动前端开发服务器
echo ""
echo "🚀 启动前端开发服务器（Vite）..."
echo "前端地址：http://localhost:5173"
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# 显示服务状态
echo ""
echo "================================"
echo "✓ 所有服务已启动！"
echo "================================"
echo ""
echo "📍 前端: http://localhost:5173"
echo "📍 后端: http://localhost:8000"
echo "📍 API 文档: http://localhost:8000/docs"
echo ""
echo "按 Ctrl+C 停止所有服务..."
echo ""

# 等待后端和前端进程
wait
