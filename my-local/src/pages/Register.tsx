import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, Typography, Card, Select } from 'antd'
import { initializeApp } from 'firebase/app'
import { getFirestore, doc, setDoc } from 'firebase/firestore'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const { Title } = Typography
const { Option } = Select

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDsyD_cVcBnnin4DWc9XPb6iQ6xZtX6jk4",
  authDomain: "link-ddaac.firebaseapp.com",
  projectId: "link-ddaac",
  storageBucket: "link-ddaac.firebasestorage.app",
  messagingSenderId: "285266088509",
  appId: "1:285266088509:web:ef32b9628fea44646c1054"
}

// Firebase init
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const API_KEY = firebaseConfig.apiKey

const getUsernameFromEmail = (email: string) => email.split('@')[0]

const Register: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const onFinish = async (values: { email: string; password: string; role: string }) => {
    setLoading(true)

    try {
      // Firebase Auth register
      const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`
      const data = { email: values.email, password: values.password, returnSecureToken: true }

      const res = await axios.post(url, data)
      const uid = res.data.localId

      // Save user data in Firestore
      await setDoc(doc(db, "users", uid), {
        email: values.email,
        role: values.role,
        createdAt: new Date()
      })

      // Save role in localStorage
      localStorage.setItem('userRole', values.role)

      toast.success("Registration successful!")

      const username = getUsernameFromEmail(values.email)

      if (values.role === 'employer') navigate(`/employer/${username}`)
      else navigate(`/job-seeker/${username}`)

    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || 'An error occurred!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f2f5',
        padding: '20px',
      }}
    >
      <Card
        style={{ width: 400 }}
        hoverable
      >
        <Title level={2} style={{ textAlign: 'center', marginBottom: 30 }}>
          Register
        </Title>

        <Form
          name="registerForm"
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          initialValues={{ email: '', password: '', role: 'jobSeeker' }}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Please enter your password' },
              { min: 6, message: 'Password must be at least 6 characters' },
            ]}
            hasFeedback
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item
            label="Select Role"
            name="role"
            rules={[{ required: true, message: 'Please select a role' }]}
          >
            <Select>
              <Option value="jobSeeker">Job Seeker</Option>
              <Option value="employer">Employer</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              size="large"
            >
              Register
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Register
