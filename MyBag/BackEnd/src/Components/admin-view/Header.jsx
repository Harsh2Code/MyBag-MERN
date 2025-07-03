import React, { useState, useEffect } from 'react';
import { AlignJustify, LogOut, House } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { LogoutUser } from '../../store/authSlice/authSlice';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    dispatch(LogoutUser());
    console.log("User logged out");
    navigate('/login');
  };

  return (
    <>
      <header className="container-fluid px-0">
        <div className="d-flex align-items-center py-3 bg-background border-bottom">
          <div className='w-100 d-flex justify-content-between align-items-center ps-5'>
          {windowWidth <= 800 && (
            <button 
              className='btn btn-dark btn btn-dark-dark me-4' 
              aria-label="Toggle menu" 
              onClick={handleToggle}
            >
              <AlignJustify />    
              <span className="ms-2">Toggle</span>
            </button>
          )}
            <div className="ps-5">
              {/* Navigation content can go here */}
            </div>
            <button 
              className='btn btn-dark btn btn-dark-dark me-4' 
              onClick={handleLogout}
              aria-label="Log out"
            >
              <LogOut className="me-2" />
              LogOut
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
