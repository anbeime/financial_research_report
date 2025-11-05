import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import HomePage from './pages/HomePage'
import GenerateReportPage from './pages/GenerateReportPage'
import TaskStatusPage from './pages/TaskStatusPage'
import ScheduledTasksPage from './pages/ScheduledTasksPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/generate" element={<GenerateReportPage />} />
            <Route path="/tasks" element={<TaskStatusPage />} />
            <Route path="/scheduled-tasks" element={<ScheduledTasksPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
