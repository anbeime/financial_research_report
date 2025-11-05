# 部署指南

本项目采用**前后端分离**的架构，推荐使用 **Cloudflare Pages** 部署前端，Python FastAPI 后端可部署在自有服务器或云服务上。

## 架构概览

```
┌─────────────────────────────────────┐
│  Cloudflare Pages (前端)             │
│  - React Web UI                      │
│  - 静态资源托管                        │
│  - 全球加速                          │
└──────────────┬──────────────────────┘
               │ HTTP/REST API
┌──────────────▼──────────────────────┐
│  Python FastAPI 后端                 │
│  - 金融数据处理                        │
│  - AI 模型调用                       │
│  - 定时任务管理                        │
│  - 文件生成与下载                      │
└─────────────────────────────────────┘
```

## 前端部署 (Cloudflare Pages)

### 步骤 1: 构建前端

```bash
cd frontend
npm install
npm run build
```

### 步骤 2: 部署到 Cloudflare Pages

#### 方式 A: 通过 Git 自动部署（推荐）

1. 将项目推送到 GitHub
2. 在 Cloudflare Pages 控制台连接 GitHub 仓库
3. 配置构建设置：
   - **构建命令**：`npm run build`
   - **构建输出目录**：`frontend/dist`
   - **根目录**：`frontend`

#### 方式 B: 手动部署

```bash
# 安装 Wrangler CLI
npm install -g wrangler

# 部署
cd frontend/dist
wrangler pages deploy
```

### 步骤 3: 配置环境变量

在 Cloudflare Pages 构建设置中，添加环境变量：

```
VITE_API_URL=https://your-api-domain.com/api
```

将 `your-api-domain.com` 替换为后端 API 的实际地址。

## 后端部署

### 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 创建 .env 文件（复制 .env.example）
cp .env.example .env

# 启动开发服务器
python app.py
```

服务器将在 `http://localhost:8000` 启动，API 文档可访问 `http://localhost:8000/docs`

### 云服务部署

#### 方式 1: Render.com（推荐，免费试用）

1. 连接 GitHub 仓库到 Render
2. 创建 Web Service
3. 构建命令：`pip install -r requirements.txt`
4. 启动命令：`uvicorn app:app --host 0.0.0.0 --port 8000`
5. 添加环境变量：`OPENAI_API_KEY` 等

#### 方式 2: PythonAnywhere

1. 上传项目代码
2. 在 Web 应用中配置 Python 版本和 WSGI 文件
3. 创建虚拟环境并安装依赖
4. 配置环境变量

#### 方式 3: AWS Lambda + API Gateway

1. 打包应用为 Lambda 函数
2. 配置 API Gateway 提供 REST 端点
3. 使用 AWS Secrets Manager 管理敏感信息

#### 方式 4: Docker + 自有服务器

```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
```

启动容器：
```bash
docker build -t financial-research .
docker run -p 8000:8000 -e OPENAI_API_KEY=xxx financial-research
```

## 环境配置

后端需要配置以下环境变量（在 `.env` 文件中）：

```env
# OpenAI 配置
OPENAI_API_KEY=sk-xxxxxx
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4

# （可选）其他模型配置
# 例如使用火山引擎
# OPENAI_BASE_URL=https://ark.cn-beijing.volces.com/api/v3
# OPENAI_MODEL=deepseek-r1
```

## 本地完整测试

### 1. 启动后端

```bash
python -m pip install -r requirements.txt
python app.py
```

### 2. 启动前端开发服务器

```bash
cd frontend
npm install
npm run dev
```

### 3. 访问应用

打开浏览器访问 `http://localhost:5173`

## 监控与日志

### 后端日志

启用详细日志：

```bash
LOGLEVEL=DEBUG python app.py
```

### Cloudflare Pages 日志

在 Cloudflare 控制台可查看构建和部署日志。

## 常见问题

### Q: API 跨域请求失败？
A: 确保后端配置了 CORS（已在 `app.py` 中配置），允许来自 Pages 域名的请求。

### Q: 环境变量未生效？
A: 重启应用并检查 `.env` 文件是否正确加载，使用 `load_dotenv()` 确保环境变量被读取。

### Q: 定时任务不执行？
A: 确保后端服务一直在线，APScheduler 需要长时间连接来执行定时任务。

### Q: 研报生成超时？
A: 增加 FastAPI 的超时配置，或使用 Celery + Redis 处理长时间任务。

## 生产部署建议

1. **使用 HTTPS**：Cloudflare Pages 自动提供 HTTPS
2. **配置 CDN**：使用 Cloudflare CDN 加速静态资源
3. **数据库**：可选，用于存储任务历史
4. **缓存**：使用 Redis 缓存 API 响应
5. **监控**：集成 Sentry 或类似工具监控错误
6. **备份**：定期备份生成的研报文件

## 获取帮助

- 查看 API 文档：后端地址 + `/docs`
- 查看项目 README：`README.md`
- 提交 Issue：GitHub Issues
