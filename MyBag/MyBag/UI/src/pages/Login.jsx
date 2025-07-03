import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { LoginUser } from '../store/authSlice/authSlice'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function Login() {
  const [formData, setFormData] = useState({
    Email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { Email, password } = formData;
    authenticateUser({ Email, password });
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const authenticateUser = async ({ Email, password }) => {
    try {
      console.log('Attempting login with:', { Email, password });
      const result = await dispatch(LoginUser({ Email, password })).unwrap();
      console.log('Login result:', result);
      
      if (result?.success) {
        toast.success('Login successful!');
        navigate(result.user?.role === 'admin' ? '/admin/dashboard' : '/');
        return true;
      } else {
        toast.error(result?.message || 'Login failed');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error?.response?.data?.message || error?.message || 'Login failed');
      return false;
    }
  };

  return (
    <div className="login-page d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <ToastContainer position="top-right" autoClose={5000} />
      <div className='p-4 shadow-sm' style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className='mb-4 text-center'>Login</h2>
        <h6 className="text-center mb-4">
          Don't have an Account?{' '}
          <Link to="/register">
            Register
          </Link>
        </h6>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
              placeholder="Enter Your Email"
              id="email"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              className="form-control"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter Your Password"
              id="password"
              required
            />
          </div>
          <button type="submit" className="btn btn-dark w-100">Submit</button>
        </form>
      </div>
    </div>
  )
}
