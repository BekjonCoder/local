import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, Card } from 'antd';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const { Title } = Typography;

// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDsyD_cVcBnnin4DWc9XPb6iQ6xZtX6jk4",
  authDomain: "link-ddaac.firebaseapp.com",
  projectId: "link-ddaac",
  storageBucket: "link-ddaac.firebasestorage.app",
  messagingSenderId: "285266088509",
  appId: "1:285266088509:web:ef32b9628fea44646c1054"
};

// ✅ Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const API_KEY = firebaseConfig.apiKey;

const getUsernameFromEmail = (email: string) => email.split('@')[0];

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);

    try {
      // 🔹 Firebase Authentication Login
      const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;
      const data = { email: values.email, password: values.password, returnSecureToken: true };

      const res = await axios.post(url, data);
      const uid = res.data.localId; // ✅ Unique user ID
      const username = getUsernameFromEmail(values.email);

      // 🔹 Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();

        // 🔹 Role-based navigation
        if (userData.role === 'employer') {
          toast.success('Login successful! Redirecting to employer dashboard...');
          navigate(`/employer/${username}`);
        } else if (userData.role === 'jobSeeker') {
          toast.success('Login successful! Redirecting to job seeker dashboard...');
          navigate(`/job-seeker/${username}`);
        } else {
          toast.error('Invalid user role. Please contact support.');
        }
      } else {
        toast.error('User data not found in Firestore.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
          Login
        </Title>

        <Form
          name="loginForm"
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          initialValues={{ email: '', password: '' }}
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
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              size="large"
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
