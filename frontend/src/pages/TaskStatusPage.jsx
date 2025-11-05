import React, { useState, useEffect } from 'react'
import { listTasks, getTaskStatus, downloadReport, cancelTask } from '../api/client'
import { CheckCircle, Clock, AlertCircle, Download, Trash2, RefreshCw } from 'lucide-react'
import '../styles/TaskStatusPage.css'

function TaskStatusPage() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusFilter, setStatusFilter] = useState(null)

  const statusLabels = {
    pending: '待处理',
    running: '运行中',
    completed: '已完成',
    failed: '失败',
    cancelled: '已取消',
  }

  const statusColors = {
    pending: 'status-pending',
    running: 'status-running',
    completed: 'status-completed',
    failed: 'status-failed',
    cancelled: 'status-cancelled',
  }

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await listTasks(statusFilter)
      setTasks(response.tasks || [])
      setError(null)
    } catch (err) {
      setError('获取任务列表失败')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
    // 自动刷新任务状态（每 3 秒）
    const interval = setInterval(fetchTasks, 3000)
    return () => clearInterval(interval)
  }, [statusFilter])

  const handleRefresh = () => {
    fetchTasks()
  }

  const handleDownload = async (taskId) => {
    try {
      const blob = await downloadReport(taskId)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `research_report_${taskId}.docx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      alert('下载失败，请稍后重试')
    }
  }

  const handleCancel = async (taskId) => {
    if (confirm('确定要取消这个任务吗？')) {
      try {
        await cancelTask(taskId)
        fetchTasks()
      } catch (err) {
        alert('取消失败')
      }
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="icon-success" size={20} />
      case 'running':
        return <Clock className="icon-running" size={20} />
      case 'failed':
        return <AlertCircle className="icon-error" size={20} />
      default:
        return <Clock className="icon-default" size={20} />
    }
  }

  return (
    <div className="tasks-page">
      <div className="page-header">
        <h1>任务进度跟踪</h1>
        <p>查看所有金融研报生成任务的实时进度</p>
      </div>

      <div className="controls">
        <div className="filter-group">
          <button
            className={`filter-btn ${statusFilter === null ? 'active' : ''}`}
            onClick={() => setStatusFilter(null)}
          >
            全部
          </button>
          {Object.entries(statusLabels).map(([key, label]) => (
            <button
              key={key}
              className={`filter-btn ${statusFilter === key ? 'active' : ''}`}
              onClick={() => setStatusFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>
        <button className="refresh-btn" onClick={handleRefresh}>
          <RefreshCw size={18} />
          刷新
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>加载中...</p>
        </div>
      )}

      {!loading && tasks.length === 0 && (
        <div className="empty-state">
          <p>暂无任务</p>
        </div>
      )}

      {!loading && tasks.length > 0 && (
        <div className="tasks-grid">
          {tasks.map(task => (
            <div key={task.id} className="task-card">
              <div className="task-header">
                <div className="task-title">
                  {getStatusIcon(task.status)}
                  <div>
                    <h3>{task.company}</h3>
                    <p className="task-code">
                      {task.market}:{task.code}
                    </p>
                  </div>
                </div>
                <span className={`status-badge ${statusColors[task.status]}`}>
                  {statusLabels[task.status]}
                </span>
              </div>

              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${task.progress}%` }}></div>
              </div>
              <p className="progress-text">{task.progress}% 完成</p>

              <div className="task-info">
                <div className="info-item">
                  <span className="label">创建时间</span>
                  <span className="value">{new Date(task.created_at).toLocaleString('zh-CN')}</span>
                </div>
                {task.completed_at && (
                  <div className="info-item">
                    <span className="label">完成时间</span>
                    <span className="value">{new Date(task.completed_at).toLocaleString('zh-CN')}</span>
                  </div>
                )}
              </div>

              {task.error && (
                <div className="error-message">
                  <strong>错误：</strong> {task.error}
                </div>
              )}

              <div className="task-actions">
                {task.status === 'completed' && (
                  <button
                    className="action-btn download-btn"
                    onClick={() => handleDownload(task.id)}
                  >
                    <Download size={18} />
                    下载报告
                  </button>
                )}
                {task.status === 'pending' && (
                  <button
                    className="action-btn cancel-btn"
                    onClick={() => handleCancel(task.id)}
                  >
                    <Trash2 size={18} />
                    取消任务
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TaskStatusPage
