# PowerShell启动脚本 - Windows 用户

Write-Host "================================" -ForegroundColor Cyan
Write-Host "金融研报生成系统 - 完整启动" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# 检查 Python
Write-Host "✓ 检查 Python..." -ForegroundColor Green
$pythonCheck = & python --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 需要安装 Python 3.8+" -ForegroundColor Red
    exit 1
}
Write-Host $pythonCheck -ForegroundColor Gray

# 检查 Node.js
Write-Host "✓ 检查 Node.js..." -ForegroundColor Green
$nodeCheck = & node --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 需要安装 Node.js 16+" -ForegroundColor Red
    exit 1
}
Write-Host $nodeCheck -ForegroundColor Gray

# 创建虚拟环境
if (!(Test-Path "venv")) {
    Write-Host "📦 创建 Python 虚拟环境..." -ForegroundColor Yellow
    & python -m venv venv
}

# 激活虚拟环境
Write-Host "✓ 激活虚拟环境..." -ForegroundColor Green
& .\venv\Scripts\Activate.ps1

# 安装 Python 依赖
Write-Host "📦 安装 Python 依赖..." -ForegroundColor Yellow
& pip install -q -r requirements.txt

# 启动后端
Write-Host ""
Write-Host "🚀 启动后端服务 (FastAPI)..." -ForegroundColor Green
Write-Host "后端地址: http://localhost:8000" -ForegroundColor Cyan
Write-Host "API 文档: http://localhost:8000/docs" -ForegroundColor Cyan
Start-Process -FilePath python -ArgumentList "app.py" -WindowStyle Normal

# 等待后端启动
Write-Host "⏳ 等待后端启动..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# 安装前端依赖
if (!(Test-Path "frontend\node_modules")) {
    Write-Host "📦 安装前端依赖..." -ForegroundColor Yellow
    Set-Location frontend
    & npm install -q
    Set-Location ..
}

# 启动前端
Write-Host ""
Write-Host "🚀 启动前端开发服务器 (Vite)..." -ForegroundColor Green
Write-Host "前端地址: http://localhost:5173" -ForegroundColor Cyan
Start-Process -FilePath npm -ArgumentList "run", "dev" -WorkingDirectory ".\frontend" -WindowStyle Normal

# 显示启动完成
Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "✓ 所有服务已启动！" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📍 前端: http://localhost:5173" -ForegroundColor Cyan
Write-Host "📍 后端: http://localhost:8000" -ForegroundColor Cyan
Write-Host "📍 API 文档: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "请在浏览器中访问前端地址开始使用。" -ForegroundColor Green
Write-Host ""
