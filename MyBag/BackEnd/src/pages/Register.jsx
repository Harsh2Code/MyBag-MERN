import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerUser } from '../store/authSlice/authSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Register() {
  const [formData, setFormData] = useState({
    UserName: '',
    Email: '',
    Password: '',
    role: 'user'
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(formData))
      .unwrap()
      .then((data) => {
        if(data?.success) {
          toast.success('Registration successful!');
          navigate("/login");
        }
      })
      .catch((error) => {
        toast.error(error.message || 'Registration failed');
      });
  };

  return (
    <div className="register-page d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <ToastContainer position="top-right" autoClose={5000} />
      <div className='p-4 shadow-sm' style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className='mb-4 text-center'>Register</h2>
        <h6 className="text-center mb-4">
          Already have an account?{' '}
          <Link to="/login">
            Login
          </Link>
        </h6>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input 
              type="text" 
              className="form-control" 
              id="username" 
              name="UserName"
              value={formData.UserName}
              placeholder='Enter your UserName'
              onChange={handleChange} 
              required
            />
          </div>
          <div className="mb-3">
            <input 
              type="email" 
              className="form-control" 
              id="email" 
              name="Email"
              placeholder='Enter your Email'
              value={formData.Email}
              onChange={handleChange} 
              required
            />
          </div>
          <div className="mb-3">
            <input 
              type="password" 
              className="form-control" 
              id="password"
              name="Password"
              placeholder='Enter your password'
              value={formData.Password}
              onChange={handleChange} 
              required
            />
          </div>
          <div className="mb-3">
            <select 
              className="form-control"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="btn btn-dark w-100">Submit</button>
        </form>
      </div>
    </div>
  );
}
