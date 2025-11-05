import React from 'react'
import { Link } from 'react-router-dom'
import { FileText, BarChart3, Clock, Settings } from 'lucide-react'
import '../styles/Navigation.css'

function Navigation() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <FileText size={24} />
          <span>金融研报系统</span>
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              首页
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/generate" className="nav-link">
              <BarChart3 size={18} />
              生成研报
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/tasks" className="nav-link">
              <Clock size={18} />
              任务进度
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/scheduled-tasks" className="nav-link">
              <Settings size={18} />
              定时任务
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navigation
