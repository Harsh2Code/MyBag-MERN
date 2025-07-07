import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import CheckAuth from './Components/CheckAuth';
import Navbar from './Components/Navbar.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Header from './Components/admin-view/Header.jsx';
import Slidebar from './Components/admin-view/Slidebar.jsx';
import Dashboard from './pages/Admin-View/Dashboard.jsx';
import Products from './pages/Admin-View/Products.jsx';
import AdminOrdersView from './Components/admin-view/orders.jsx'; 
import Orders from './pages/Shopping-View/orders.jsx';
import ShoppingHome from './pages/Shopping-View/home.jsx';
import Listing from './pages/Shopping-View/Listing.jsx';
import Checkout from './pages/Shopping-View/Checkout.jsx';
import PaymentReturn from './pages/Shopping-View/Payment-return.jsx';
import ShoppingAccount from './pages/Shopping-View/account.jsx';
import ContactUs from './pages/Shopping-View/ContactUs.jsx';
import './App.css';
import './Components/admin-view/admin-layout.css';
import { checkAuth } from './store/authSlice/authSlice.js';
import Queries from './pages/Admin-View/Queries.jsx';
import LoaderTest from './pages/LoaderTest.jsx';

function Home() {
  return (
    <div className="container mt-5">
      <h1>Welcome to MyApp</h1>
      <p>Please login or register to continue</p>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import Footer from './pages/Footer.jsx';
function App() {
  const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [authChecked, setAuthChecked] = React.useState(false);

  React.useEffect(() => {
    dispatch(checkAuth()).catch(() => {
      console.log('Auth check failed - proceeding with default state');
    }).finally(() => {
      setAuthChecked(true);
    });
  }, [dispatch]);
  
  // Temporarily bypass loading state for testing loader page
  // if (isLoading || !authChecked) {
  //   return <div>Loading...</div>;
  // }

  console.log('App.jsx CheckAuth props:', { user, isAuthenticated });

  return (
    <div className="app-container container-fluid min-vh-100" style={{boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1) !important'}}>
      <Routes>
        <Route path="/admin/*" element={
          <div className="admin-layout">
            <Header className="admin-header" />
            <div className="admin-content">
              <Slidebar className="admin-sidebar" />
              <main className="admin-main">
                <Routes>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="products" element={<Products />} />
                  <Route path="orders" element={<AdminOrdersView />} /> {/* updated route */}
                  <Route path="Queries" element={<Queries />} />
                </Routes>
              </main>
            </div>
          </div>
        } />
        <Route path="/loader-test" element={
          <>
            <Navbar />
            {/* Temporarily remove CheckAuth to debug routing */}
            {/* <CheckAuth isAuthenticated={isAuthenticated} user={user}> */}
              <LoaderTest />
            {/* </CheckAuth> */}
            {/* Footer removed as per request */}
          </>
        } />
        <Route path="/" element={
          <>
            <Navbar />
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <Home />
            </CheckAuth>
            <Footer/>
          </>
        } />
        <Route path="/shop/*" element={
          <>
            <Navbar />
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <Routes>
                <Route index element={<ShoppingHome />} />
                <Route path="listing" element={<Listing />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="payment" element={<PaymentReturn />} />
                <Route path="account" element={<ShoppingAccount />} />
                <Route path="contact-us" element={<ContactUs />} />
                <Route path="orders" element={<Orders />} />
              </Routes>
            </CheckAuth>
          </>
        } />
        <Route path="/login" element={
          <>
            <Navbar />
            <Login />
          </>
        } />
        <Route path="/register" element={
          <>
            <Navbar />
            <Register />
          </>
        } />
        {!isAuthenticated && <Route path="/admin/*" element={<Navigate to="/login" replace />} />}
      </Routes>
    </div>
  );
}

export default App;
