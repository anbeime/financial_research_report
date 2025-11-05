import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ========== 研报生成 API ==========

/**
 * 生成金融研报
 */
export const generateReport = async (company, code, market = 'HK') => {
  const response = await api.post('/reports/generate', {
    company,
    code,
    market,
  })
  return response.data
}

/**
 * 获取任务状态
 */
export const getTaskStatus = async (taskId) => {
  const response = await api.get(`/tasks/${taskId}`)
  return response.data
}

/**
 * 列出所有任务
 */
export const listTasks = async (status = null) => {
  const response = await api.get('/tasks', {
    params: status ? { status } : {},
  })
  return response.data
}

/**
 * 下载研报
 */
export const downloadReport = async (taskId) => {
  const response = await api.get(`/reports/${taskId}/download`, {
    responseType: 'blob',
  })
  return response.data
}

/**
 * 取消任务
 */
export const cancelTask = async (taskId) => {
  const response = await api.post(`/tasks/${taskId}/cancel`)
  return response.data
}

// ========== 定时任务 API ==========

/**
 * 创建定时任务
 */
export const createScheduledTask = async (company, code, market, cronExpression, taskName) => {
  const response = await api.post('/scheduled-tasks', {
    company,
    code,
    market,
    cron_expression: cronExpression,
    task_name: taskName,
  })
  return response.data
}

/**
 * 列出所有定时任务
 */
export const listScheduledTasks = async () => {
  const response = await api.get('/scheduled-tasks')
  return response.data
}

/**
 * 删除定时任务
 */
export const deleteScheduledTask = async (taskName) => {
  const response = await api.delete(`/scheduled-tasks/${taskName}`)
  return response.data
}

/**
 * 健康检查
 */
export const healthCheck = async () => {
  const response = await api.get('/health')
  return response.data
}

export default api
