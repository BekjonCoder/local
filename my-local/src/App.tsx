import React from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import {
  LoginOutlined,
  UserAddOutlined,
} from '@ant-design/icons'

import Login from './pages/Login'
import Register from './pages/Register'
import JobSeekerDashboard from './pages/JobSeekerDashboard'
import EmployerDashboard from './pages/EmployerDashboard'
import 'leaflet/dist/leaflet.css'

const { Header, Content } = Layout

const App: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const showHeader = location.pathname === '/login' || location.pathname === '/register'

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {showHeader && (
        <Header>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[location.pathname.slice(1)]} 
            items={[
              { key: 'login', icon: <LoginOutlined />, label: 'Login' },
              { key: 'register', icon: <UserAddOutlined />, label: 'Register' },
            ]}
            onClick={({ key }) => {
              navigate(`/${key}`)
            }}
          />
        </Header>
      )}

      <Content style={{ padding: '20px 50px', flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/job-seeker/:username" element={<JobSeekerDashboard />} />
          <Route path="/employer/:username" element={<EmployerDashboard />} />
        </Routes>
      </Content>
    </Layout>
  )
}

export default App
