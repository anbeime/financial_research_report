import React from 'react'
import { Link } from 'react-router-dom'
import { BarChart3, Clock, Settings, Zap } from 'lucide-react'
import '../styles/HomePage.css'

function HomePage() {
  const features = [
    {
      icon: <BarChart3 size={32} />,
      title: '一键生成研报',
      description: '输入公司信息，系统自动采集数据、分析并生成完整的金融研报',
      link: '/generate',
    },
    {
      icon: <Clock size={32} />,
      title: '任务进度跟踪',
      description: '实时查看研报生成进度，支持下载已完成的研报文件',
      link: '/tasks',
    },
    {
      icon: <Settings size={32} />,
      title: '定时任务设置',
      description: '设置自动定时任务，让系统在指定时间自动生成研报',
      link: '/scheduled-tasks',
    },
  ]

  const capabilities = [
    '财务数据采集与分析',
    'AI 智能分析与预测',
    '竞争对手对标分析',
    '行业信息搜集与整理',
    'Word/Markdown 多格式输出',
    '定时自动生成任务',
  ]

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>AI 驱动的金融研报生成系统</h1>
          <p>
            基于大语言模型的全自动研报生成平台，
            <br />
            从数据采集到报告输出，一站式解决方案
          </p>
          <div className="hero-buttons">
            <Link to="/generate" className="btn btn-primary">
              <Zap size={20} />
              开始生成研报
            </Link>
            <Link to="/tasks" className="btn btn-secondary">
              查看任务进度
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <h2>核心功能</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <Link
              key={index}
              to={feature.link}
              className="feature-card"
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="capabilities">
        <div className="capabilities-container">
          <div className="capabilities-content">
            <h2>系统能力</h2>
            <ul className="capabilities-list">
              {capabilities.map((capability, index) => (
                <li key={index}>{capability}</li>
              ))}
            </ul>
          </div>
          <div className="capabilities-diagram">
            <div className="flow-diagram">
              <div className="flow-step">
                <div className="step-number">1</div>
                <p>数据采集</p>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-step">
                <div className="step-number">2</div>
                <p>AI 分析</p>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-step">
                <div className="step-number">3</div>
                <p>报告生成</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="workflow">
        <h2>使用流程</h2>
        <div className="workflow-steps">
          <div className="workflow-step">
            <div className="step-title">第一步</div>
            <h3>输入公司信息</h3>
            <p>进入"生成研报"页面，输入目标公司名称、股票代码和所属市场</p>
          </div>
          <div className="workflow-step">
            <div className="step-title">第二步</div>
            <h3>自动数据采集</h3>
            <p>系统自动采集财务数据、竞争对手信息、行业动态等多维度数据</p>
          </div>
          <div className="workflow-step">
            <div className="step-title">第三步</div>
            <h3>AI 智能分析</h3>
            <p>利用大语言模型进行财务分析、趋势预测和投资建议生成</p>
          </div>
          <div className="workflow-step">
            <div className="step-title">第四步</div>
            <h3>下载报告</h3>
            <p>任务完成后下载 Word 或 Markdown 格式的完整研报文档</p>
          </div>
        </div>
      </section>

      <section className="deployment-info">
        <h2>部署信息</h2>
        <div className="deployment-content">
          <div className="deployment-item">
            <h3>🌍 前端托管</h3>
            <p>本应用前端已部署到 Cloudflare Pages，享受全球加速和可靠性</p>
          </div>
          <div className="deployment-item">
            <h3>🔌 后端 API</h3>
            <p>Python FastAPI 后端服务，提供高性能的研报生成和任务管理能力</p>
          </div>
          <div className="deployment-item">
            <h3>⚙️ 定时任务</h3>
            <p>支持 APScheduler 定时任务，可设置自动生成研报的时间表</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
