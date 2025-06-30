import React, { useState } from 'react';
import { User, ShoppingCart, LogOut } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import UserCartWrapper from './cart-wrapper';
import { Dropdown, DropdownButton, Modal, Button, Nav, Navbar, Container } from 'react-bootstrap';

function MenuItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem('filters');
    const currentFilter =
      getCurrentMenuItem.id !== 'home' &&
      getCurrentMenuItem.id !== 'products' &&
      getCurrentMenuItem.id !== 'search'
        ? {
            category: [getCurrentMenuItem.id],
          }
        : null;

    sessionStorage.setItem('filters', JSON.stringify(currentFilter));

    if (location.pathname.includes('listing') && currentFilter !== null) {
      setSearchParams(new URLSearchParams(`?category=${getCurrentMenuItem.id}`));
    } else {
      navigate(getCurrentMenuItem.path);
    }
  }

  return (
    <Nav className="flex-column flex-lg-row mb-3 mb-lg-0 align-items-lg-center gap-3">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <Nav.Link
          onClick={() => handleNavigate(menuItem)}
          className="text-sm font-weight-medium cursor-pointer"
          key={menuItem.id}
        >
          {menuItem.label}
        </Nav.Link>
      ))}
    </Nav>
  );
}

import Navbar from '../Navbar';

function HeaderRightContent() {
  return <Navbar />;
}

function ShoppingHeader() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top" className="container-fluid">
      <Container className="d-flex justify-content-between align-items-center">
        <Link to="/shop/home" className="navbar-brand d-flex align-items-center">
          <span className="fw-bold text-secondary">E-Commerce</span>
        </Link>

        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <MenuItems />
          {isAuthenticated && <HeaderRightContent />}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default ShoppingHeader;
