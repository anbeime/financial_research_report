import React, { useState } from 'react'
import { createScheduledTask, listScheduledTasks, deleteScheduledTask } from '../api/client'
import { Plus, Trash2, AlertCircle, CheckCircle } from 'lucide-react'
import '../styles/ScheduledTasksPage.css'

function ScheduledTasksPage() {
  const [formData, setFormData] = useState({
    taskName: '',
    company: '',
    code: '',
    market: 'HK',
    cronExpression: '0 9 * * MON-FRI', // 默认每个工作日早上 9 点
  })
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const cronPresets = {
    '0 9 * * MON-FRI': '每个工作日上午 9 点',
    '0 0 * * 0': '每个周一午夜 0 点',
    '0 0 * * *': '每天午夜 0 点',
    '0 */6 * * *': '每 6 小时',
    '0 9,15 * * MON-FRI': '工作日上午 9 点和下午 3 点',
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      await createScheduledTask(
        formData.company,
        formData.code,
        formData.market,
        formData.cronExpression,
        formData.taskName
      )
      setSuccess(`定时任务 "${formData.taskName}" 创建成功！`)
      setFormData({
        taskName: '',
        company: '',
        code: '',
        market: 'HK',
        cronExpression: '0 9 * * MON-FRI',
      })
      fetchTasks()
    } catch (err) {
      setError(err.response?.data?.detail || '创建定时任务失败')
    } finally {
      setLoading(false)
    }
  }

  const fetchTasks = async () => {
    try {
      const response = await listScheduledTasks()
      setTasks(response.tasks || [])
    } catch (err) {
      setError('获取定时任务列表失败')
    }
  }

  const handleDelete = async (taskName) => {
    if (confirm(`确定要删除定时任务 "${taskName}" 吗？`)) {
      try {
        await deleteScheduledTask(taskName)
        setSuccess(`定时任务 "${taskName}" 已删除`)
        fetchTasks()
      } catch (err) {
        setError('删除定时任务失败')
      }
    }
  }

  React.useEffect(() => {
    fetchTasks()
  }, [])

  return (
    <div className="scheduled-tasks-page">
      <div className="page-header">
        <h1>定时任务管理</h1>
        <p>设置自动生成金融研报的定时任务</p>
      </div>

      <div className="scheduled-container">
        <div className="form-section">
          <h2>创建新的定时任务</h2>
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label htmlFor="taskName">任务名称</label>
              <input
                type="text"
                id="taskName"
                name="taskName"
                value={formData.taskName}
                onChange={handleChange}
                placeholder="例如：日常研报生成"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="company">公司名称</label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="例如：商汤科技"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="code">股票代码</label>
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="例如：00020"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="market">上市市场</label>
              <select
                id="market"
                name="market"
                value={formData.market}
                onChange={handleChange}
              >
                <option value="HK">港股 (HK)</option>
                <option value="A">A股 (A)</option>
                <option value="US">美股 (US)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="cronExpression">执行时间 (Cron表达式)</label>
              <select
                id="cronExpression"
                name="cronExpression"
                value={formData.cronExpression}
                onChange={handleChange}
              >
                {Object.entries(cronPresets).map(([cron, label]) => (
                  <option key={cron} value={cron}>
                    {label}
                  </option>
                ))}
              </select>
              <small className="help-text">
                Cron 格式: 分 小时 日 月 周几 (0=周日, 1-6=周一到周六)
              </small>
            </div>

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? '创建中...' : (
                <>
                  <Plus size={18} />
                  创建定时任务
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="alert alert-error">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              <CheckCircle size={20} />
              <span>{success}</span>
            </div>
          )}
        </div>

        <div className="tasks-section">
          <h2>已有定时任务 ({tasks.length})</h2>
          {tasks.length === 0 ? (
            <div className="empty-state">
              <p>暂无定时任务，创建一个来自动生成研报吧！</p>
            </div>
          ) : (
            <div className="tasks-list">
              {tasks.map(task => (
                <div key={task.id} className="task-item">
                  <div className="task-info">
                    <h3>{task.name}</h3>
                    <p className="task-schedule">
                      下次运行: {task.next_run_time ? new Date(task.next_run_time).toLocaleString('zh-CN') : '待安排'}
                    </p>
                  </div>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(task.id)}
                  >
                    <Trash2 size={18} />
                    删除
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="info-section">
        <h2>Cron 表达式说明</h2>
        <table className="cron-table">
          <thead>
            <tr>
              <th>位置</th>
              <th>含义</th>
              <th>取值范围</th>
              <th>特殊符号</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>第 1 位</td>
              <td>分</td>
              <td>0-59</td>
              <td>* - , /</td>
            </tr>
            <tr>
              <td>第 2 位</td>
              <td>小时</td>
              <td>0-23</td>
              <td>* - , /</td>
            </tr>
            <tr>
              <td>第 3 位</td>
              <td>日</td>
              <td>1-31</td>
              <td>* - , /</td>
            </tr>
            <tr>
              <td>第 4 位</td>
              <td>月</td>
              <td>1-12</td>
              <td>* - , /</td>
            </tr>
            <tr>
              <td>第 5 位</td>
              <td>周几</td>
              <td>0-7 (0、7 为周日)</td>
              <td>* - , /</td>
            </tr>
          </tbody>
        </table>
        <p className="cron-example">
          <strong>示例：</strong> "0 9 * * MON-FRI" 表示每个工作日上午 9 点执行
        </p>
      </div>
    </div>
  )
}

export default ScheduledTasksPage
