import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { LogoutUser } from '../store/authSlice/authSlice'; // Correct import with capital L
import { LuSpeech } from "react-icons/lu";
import { House, ClipboardList,CircleUserRound,ShoppingCart } from "lucide-react";

function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const getUserInitials = (name) => {
    if (!name) return '';
    const names = name.trim().split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase();
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    dispatch(LogoutUser());
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar navbar-expand-lg fixed-top" style={{ backgroundColor: 'white' }}>
      <div className="container-fluid">
        <Link className="navbar-brand" to="/"><img src="/logo.jpg" width={'60px'} height={'60px'} alt="MY BAG" /></Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* House icon as link to /shop */}
        <Link to="/shop" className="navbar-toggler" aria-label="Go to shop">
          <House size={28} />
        </Link>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <sup className='mr-4'> <b>|</b> </sup>  <a href="/shop" className='ml-4' style={{ marginLeft: ' 10px', display: 'inline-flex', color: 'black'}}> <House size={28} /> </a>
            </li>
          </ul>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {user ? (
              <>
              <li className="nav-item">
                  <button
                    className="btn nav-link d-flex align-items-center"
                    style={{ fontWeight: 'bold', border: 'none', background: 'none', cursor: 'pointer' }}
                    onClick={() => navigate('/shop/orders')}
                    aria-label="List of Orders"
                  >
                    <ClipboardList size={24} />
                    <span style={{ marginLeft: '5px' }}></span>
                  </button>
                </li>
              <li className="nav-item">
                  <button
                    className="btn nav-link d-flex align-items-center"
                    style={{ fontWeight: 'bold', border: 'none', background: 'none', cursor: 'pointer' }}
                    onClick={() => navigate('/shop/contact-us')}
                    aria-label="Connect me to Devs"
                  >
                    <LuSpeech size={24} />
                    <span style={{ marginLeft: '5px' }}></span>
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className="btn nav-link d-flex align-items-center"
                    style={{ fontWeight: 'bold', border: 'none', background: 'none', cursor: 'pointer' }}
                    onClick={() => navigate('/shop/checkout')}
                    aria-label="Go to checkout"
                  >
                    <ShoppingCart size={24} />
                    <span style={{ marginLeft: '5px' }}></span>
                  </button>
                </li>
                <li className="nav-item">
                  <button
                  className="btn nav-link d-flex align-items-center"
                    style={{ fontWeight: 'bold', border: 'none', background: 'none', cursor: 'pointer' }}
                    onClick={() => navigate('/shop/account')}
                    aria-label="Go to checkout" >
                       <CircleUserRound />
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
