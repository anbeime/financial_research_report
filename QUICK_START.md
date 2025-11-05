# 快速开始指南

欢迎使用金融研报生成系统！本指南将帮您快速上手。

## 📋 系统要求

- **Python**: 3.8 或更高版本
- **Node.js**: 16 或更高版本
- **npm**: 8 或更高版本
- **OpenAI API Key**: 用于 AI 模型调用

## ⚙️ 环境配置

### 1. 复制环境配置文件

```bash
cp .env.example .env
```

### 2. 编辑 `.env` 文件，添加您的 OpenAI API Key

```env
OPENAI_API_KEY=sk-your-api-key-here
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4
```

**支持的模型配置：**
- OpenAI: `gpt-4`, `gpt-3.5-turbo`
- 火山引擎（DuckDuckGo）: `deepseek-r1`, `deepseek-v3`
- 其他兼容接口：需要修改 `OPENAI_BASE_URL`

## 🚀 启动应用

### Windows 用户

```powershell
# 赋予执行权限（首次运行）
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# 运行启动脚本
.\start.ps1
```

### macOS / Linux 用户

```bash
# 赋予执行权限
chmod +x start.sh

# 运行启动脚本
./start.sh
```

### 手动启动（不使用脚本）

**终端 1 - 启动后端：**
```bash
pip install -r requirements.txt
python app.py
```

**终端 2 - 启动前端：**
```bash
cd frontend
npm install
npm run dev
```

## 🌐 访问应用

启动后，打开浏览器访问：

- **前端应用**: http://localhost:5173
- **API 文档**: http://localhost:8000/docs (Swagger UI)
- **API 重定向文档**: http://localhost:8000/redoc (ReDoc)

## 📖 功能说明

### 1. 生成研报

1. 点击导航栏 "生成研报"
2. 输入公司名称、股票代码、上市市场
3. 点击 "生成研报" 按钮
4. 系统将在后台自动采集数据并生成研报

### 2. 查看任务进度

1. 点击导航栏 "任务进度"
2. 查看所有生成任务的实时进度
3. 任务完成后可下载 Word 格式的研报

### 3. 定时任务设置

1. 点击导航栏 "定时任务"
2. 设置任务名称、公司信息和执行时间
3. 系统将在指定时间自动生成研报

**预设的 Cron 表达式：**
- `0 9 * * MON-FRI` - 每个工作日上午 9 点
- `0 0 * * 0` - 每周一午夜
- `0 0 * * *` - 每天午夜
- `0 */6 * * *` - 每 6 小时
- `0 9,15 * * MON-FRI` - 工作日上午 9 点和下午 3 点

## 🔌 API 端点

### 生成研报

```http
POST /api/reports/generate

Content-Type: application/json

{
  "company": "商汤科技",
  "code": "00020",
  "market": "HK"
}
```

**响应：**
```json
{
  "task_id": "uuid-string",
  "status": "accepted",
  "message": "研报生成任务已提交"
}
```

### 查询任务状态

```http
GET /api/tasks/{task_id}
```

**响应：**
```json
{
  "id": "task-id",
  "company": "商汤科技",
  "status": "running",
  "progress": 35,
  "created_at": "2024-01-01T10:00:00",
  "started_at": "2024-01-01T10:01:00"
}
```

### 下载研报

```http
GET /api/reports/{task_id}/download
```

## 📊 生成流程

```
1. 数据采集阶段 (10-20%)
   ├─ 获取目标公司财务数据
   ├─ 获取竞争对手信息
   ├─ 采集行业信息
   └─ 获取公司基础信息

2. AI 分析阶段 (20-90%)
   ├─ 财务分析
   ├─ 趋势预测
   ├─ 竞争分析
   └─ 投资建议

3. 报告生成阶段 (90-100%)
   ├─ 内容整理
   ├─ 格式化输出
   └─ Word/Markdown 生成
```

## 🐛 故障排除

### 问题：API 连接失败

**原因**：后端服务未启动或 API URL 配置错误

**解决**：
```bash
# 检查后端是否运行
curl http://localhost:8000/api/health

# 查看后端日志
python app.py  # 直接运行查看输出
```

### 问题：OpenAI API 错误

**原因**：API Key 无效或额度不足

**解决**：
```bash
# 检查环境变量
echo $OPENAI_API_KEY

# 使用 Python 测试连接
python -c "from dotenv import load_dotenv; load_dotenv(); import os; print(os.getenv('OPENAI_API_KEY'))"
```

### 问题：前端找不到后端 API

**原因**：Vite 代理配置或 CORS 问题

**解决**：
1. 检查 `vite.config.js` 中的代理配置
2. 确保后端已启用 CORS：`app.py` 中已配置
3. 检查网络连接和防火墙

### 问题：定时任务不执行

**原因**：APScheduler 需要后端持续运行

**解决**：
- 确保后端服务一直在线
- 查看后端日志确认调度器已启动
- 对于生产环境，考虑使用 Celery + Redis

## 📦 项目结构

```
financial_research_report-main/
├── frontend/                    # React 前端应用
│   ├── src/
│   │   ├── components/         # React 组件
│   │   ├── pages/             # 页面
│   │   ├── api/               # API 客户端
│   │   ├── styles/            # 样式文件
│   │   └── App.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── app.py                       # FastAPI 后端主文件
├── integrated_research_report_generator.py  # 研报生成器
├── requirements.txt             # Python 依赖
├── .env.example                # 环境变量示例
├── DEPLOYMENT.md               # 部署指南
└── QUICK_START.md             # 本文件
```

## 🚀 部署到生产环境

详见 `DEPLOYMENT.md` 文件，支持：
- Cloudflare Pages (前端)
- Render.com (后端)
- AWS Lambda / PythonAnywhere (其他选项)
- Docker 容器化部署

## 🆘 获取帮助

1. 查看 API 文档：访问 http://localhost:8000/docs
2. 查看项目主 README：`README.md`
3. 查看部署指南：`DEPLOYMENT.md`
4. 提交问题：GitHub Issues

## 📝 常见问题 (FAQ)

**Q: 为什么生成研报需要这么长时间？**

A: 系统需要：
- 调用多个金融 API 采集数据（通常 3-5 秒）
- 调用 OpenAI GPT-4 进行分析（通常 10-20 秒）
- 处理和格式化结果（通常 5-10 秒）

总时长通常为 20-60 分钟。

**Q: 可以修改生成报告的内容吗？**

A: 可以！修改以下文件：
- 数据采集逻辑：`integrated_research_report_generator.py`
- Prompt 模板：`data_analysis_agent/prompts.py`
- 输出格式：`integrated_research_report_generator.py` 的第二阶段

**Q: 支持哪些市场的股票？**

A: 目前支持：
- 港股 (HK)
- A股 (A) - 部分功能
- 美股 (US) - 有限支持

可根据需要扩展。

## 📄 许可证

MIT License - 详见 LICENSE 文件

---

祝您使用愉快！有问题或建议？欢迎反馈 😊
