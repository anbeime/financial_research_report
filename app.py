"""
FastAPI 后端服务 - 金融研报生成系统
提供 REST API 接口，支持：
1. 实时生成研报
2. 定时任务管理
3. 任务状态查询
4. 文件下载
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
import os
import json
import uuid
import asyncio
from typing import Optional, Dict, Any
from apscheduler.schedulers.background import BackgroundScheduler
from integrated_research_report_generator import IntegratedResearchReportGenerator

# ========== 初始化 FastAPI 应用 ==========
app = FastAPI(
    title="金融研报生成系统 API",
    description="支持实时生成和定时任务的金融研报生成服务",
    version="1.0.0"
)

# ========== CORS 配置 ==========
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ========== 全局状态管理 ==========
class TaskManager:
    """任务管理器 - 存储和跟踪生成任务"""
    def __init__(self):
        self.tasks: Dict[str, Dict[str, Any]] = {}
    
    def create_task(self, company: str, code: str, market: str) -> str:
        """创建新任务"""
        task_id = str(uuid.uuid4())
        self.tasks[task_id] = {
            "id": task_id,
            "company": company,
            "code": code,
            "market": market,
            "status": "pending",  # pending, running, completed, failed
            "progress": 0,
            "created_at": datetime.now().isoformat(),
            "started_at": None,
            "completed_at": None,
            "error": None,
            "output_path": None,
        }
        return task_id
    
    def update_task(self, task_id: str, **kwargs):
        """更新任务状态"""
        if task_id in self.tasks:
            self.tasks[task_id].update(kwargs)
    
    def get_task(self, task_id: str) -> Optional[Dict]:
        """获取任务信息"""
        return self.tasks.get(task_id)
    
    def list_tasks(self) -> list:
        """列出所有任务"""
        return list(self.tasks.values())

task_manager = TaskManager()

# ========== 数据模型 ==========
class GenerateReportRequest(BaseModel):
    """生成研报请求"""
    company: str
    code: str
    market: str = "HK"

class ScheduledTaskRequest(BaseModel):
    """定时任务请求"""
    company: str
    code: str
    market: str = "HK"
    cron_expression: str  # 例如: "0 9 * * MON-FRI" (每个工作日早上9点)
    task_name: str

class TaskResponse(BaseModel):
    """任务响应"""
    id: str
    company: str
    code: str
    market: str
    status: str
    progress: int
    created_at: str
    started_at: Optional[str] = None
    completed_at: Optional[str] = None
    error: Optional[str] = None

# ========== 后台任务处理 ==========
async def generate_report_background(task_id: str, company: str, code: str, market: str):
    """在后台生成研报"""
    try:
        # 更新任务状态为运行中
        task_manager.update_task(task_id, status="running", started_at=datetime.now().isoformat())
        
        # 创建生成器实例
        generator = IntegratedResearchReportGenerator(
            target_company=company,
            target_company_code=code,
            target_company_market=market
        )
        
        # 执行数据采集
        task_manager.update_task(task_id, progress=10)
        generator.stage1_data_collection()
        
        # 执行研报生成
        task_manager.update_task(task_id, progress=50)
        report_path = generator.stage2_report_generation()
        
        # 任务完成
        task_manager.update_task(
            task_id,
            status="completed",
            progress=100,
            completed_at=datetime.now().isoformat(),
            output_path=report_path
        )
    except Exception as e:
        # 任务失败
        task_manager.update_task(
            task_id,
            status="failed",
            error=str(e),
            completed_at=datetime.now().isoformat()
        )

# ========== API 路由 ==========

@app.get("/api/health")
async def health_check():
    """健康检查"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/api/reports/generate")
async def generate_report(request: GenerateReportRequest, background_tasks: BackgroundTasks):
    """
    生成金融研报 (异步)
    
    Args:
        request: 包含公司名称、代码、市场的请求
    
    Returns:
        包含任务ID的响应，可用于查询进度
    """
    try:
        # 创建任务
        task_id = task_manager.create_task(
            company=request.company,
            code=request.code,
            market=request.market
        )
        
        # 添加后台任务
        background_tasks.add_task(
            generate_report_background,
            task_id,
            request.company,
            request.code,
            request.market
        )
        
        return {
            "task_id": task_id,
            "status": "accepted",
            "message": "研报生成任务已提交，请使用 task_id 查询进度"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/tasks/{task_id}")
async def get_task_status(task_id: str):
    """
    查询任务状态
    
    Args:
        task_id: 任务ID
    
    Returns:
        任务详细信息和进度
    """
    task = task_manager.get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="任务不存在")
    
    return task

@app.get("/api/tasks")
async def list_tasks(status: Optional[str] = None):
    """
    列出所有任务
    
    Args:
        status: 可选，按状态过滤 (pending, running, completed, failed)
    
    Returns:
        任务列表
    """
    tasks = task_manager.list_tasks()
    
    if status:
        tasks = [t for t in tasks if t["status"] == status]
    
    return {"tasks": tasks, "total": len(tasks)}

@app.get("/api/reports/{task_id}/download")
async def download_report(task_id: str):
    """
    下载生成的研报
    
    Args:
        task_id: 任务ID
    
    Returns:
        研报文件
    """
    task = task_manager.get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="任务不存在")
    
    if task["status"] != "completed":
        raise HTTPException(status_code=400, detail="任务未完成或失败")
    
    output_path = task.get("output_path")
    if not output_path or not os.path.exists(output_path):
        raise HTTPException(status_code=404, detail="文件不存在")
    
    return FileResponse(
        output_path,
        media_type="application/octet-stream",
        filename=os.path.basename(output_path)
    )

@app.post("/api/tasks/{task_id}/cancel")
async def cancel_task(task_id: str):
    """
    取消任务 (仅限于 pending 状态)
    
    Args:
        task_id: 任务ID
    
    Returns:
        操作结果
    """
    task = task_manager.get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="任务不存在")
    
    if task["status"] != "pending":
        raise HTTPException(status_code=400, detail="只能取消待处理的任务")
    
    task_manager.update_task(task_id, status="cancelled")
    return {"message": "任务已取消"}

# ========== 定时任务支持 ==========
scheduler = BackgroundScheduler()

def scheduled_report_generation(company: str, code: str, market: str):
    """定时生成研报"""
    task_id = task_manager.create_task(company, code, market)
    asyncio.run(generate_report_background(task_id, company, code, market))

@app.post("/api/scheduled-tasks")
async def create_scheduled_task(request: ScheduledTaskRequest):
    """
    创建定时任务
    
    Args:
        request: 包含公司信息和 cron 表达式
    
    Returns:
        定时任务创建结果
    """
    try:
        scheduler.add_job(
            scheduled_report_generation,
            'cron',
            args=[request.company, request.code, request.market],
            id=request.task_name,
            name=f"{request.task_name} - {request.company}",
            replace_existing=True
        )
        
        return {
            "message": "定时任务创建成功",
            "task_name": request.task_name,
            "cron": request.cron_expression
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/scheduled-tasks")
async def list_scheduled_tasks():
    """列出所有定时任务"""
    jobs = scheduler.get_jobs()
    return {
        "tasks": [
            {
                "id": job.id,
                "name": job.name,
                "next_run_time": str(job.next_run_time)
            }
            for job in jobs
        ]
    }

@app.delete("/api/scheduled-tasks/{task_name}")
async def delete_scheduled_task(task_name: str):
    """删除定时任务"""
    try:
        scheduler.remove_job(task_name)
        return {"message": "定时任务已删除"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ========== 启动和关闭事件 ==========
@app.on_event("startup")
async def startup():
    """应用启动时执行"""
    scheduler.start()
    print("调度器已启动")

@app.on_event("shutdown")
async def shutdown():
    """应用关闭时执行"""
    scheduler.shutdown()
    print("调度器已关闭")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=True
    )
