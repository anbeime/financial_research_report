import React, { useState } from 'react'
import { generateReport } from '../api/client'
import { AlertCircle, CheckCircle, Loader } from 'lucide-react'
import '../styles/GenerateReportPage.css'

function GenerateReportPage() {
  const [formData, setFormData] = useState({
    company: '商汤科技',
    code: '00020',
    market: 'HK',
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

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
    setResult(null)

    try {
      const response = await generateReport(
        formData.company,
        formData.code,
        formData.market
      )
      setResult(response)
    } catch (err) {
      setError(err.response?.data?.detail || '生成研报失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="generate-page">
      <div className="page-header">
        <h1>生成金融研报</h1>
        <p>输入公司信息，系统将自动采集数据并生成详细的金融研报</p>
      </div>

      <div className="generate-container">
        <form onSubmit={handleSubmit} className="form">
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

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? (
              <>
                <Loader className="spinner" />
                生成中...
              </>
            ) : (
              '生成研报'
            )}
          </button>
        </form>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {result && (
          <div className="alert alert-success">
            <CheckCircle size={20} />
            <div>
              <p>研报生成任务已提交！</p>
              <p className="task-id">任务ID: {result.task_id}</p>
              <a href="/tasks" className="view-link">
                点击查看任务进度 →
              </a>
            </div>
          </div>
        )}
      </div>

      <div className="info-section">
        <h2>生成流程说明</h2>
        <ul>
          <li><strong>第一阶段</strong>：数据采集与基础分析（采集财务数据、竞争对手信息、行业信息）</li>
          <li><strong>第二阶段</strong>：深度分析与报告生成（AI 分析、可视化、最终报告生成）</li>
          <li><strong>输出格式</strong>：支持 Word 和 Markdown 两种格式</li>
          <li><strong>生成时长</strong>：通常需要 10-30 分钟（取决于数据量和 API 响应速度）</li>
        </ul>
      </div>
    </div>
  )
}

export default GenerateReportPage
