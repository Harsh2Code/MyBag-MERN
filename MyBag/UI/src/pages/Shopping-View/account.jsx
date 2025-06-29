import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import accImg from "../../assets/account.jpg";
import { getAllOrdersByUserId } from '../../store/Shop/Order-Slice/OrderSlice';
import { fetchAllAddresses } from '../../store/Shop/Address-Slice/Address-Slice';
import { LogoutUser } from '../../store/authSlice/authSlice';
import { fetchUserProfile } from '../../store/authSlice/userProfileSlice';

function ShoppingAccount() {
  const [activeTab, setActiveTab] = useState('orders');
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { userProfile, isLoading: profileLoading, error: profileError } = useSelector((state) => state.userProfile);
  console.log('User object in account.jsx:', user);
  const { orderList, isLoading: ordersLoading } = useSelector((state) => state.shoppingOrder);
  const { addressList, isLoading: addressesLoading } = useSelector((state) => state.shopAddress);

  useEffect(() => {
    if (user && user.userId) {
      dispatch(getAllOrdersByUserId(user.userId));
      dispatch(fetchAllAddresses(user.userId));
      dispatch(fetchUserProfile(user.userId));
    }
  }, [user, dispatch]);

  const handleLogout = async () => {
    await dispatch(LogoutUser());
    window.location.href = '/login';
  };

  // Format createdAt date if available
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="container mt-4" style={{ position: 'relative', paddingTop: '80px' }}>
      <button
        onClick={handleLogout}
        style={{
          position: 'absolute',
          top: '38px',
          right: '10px',
          backgroundColor: '#333',
          color: '#fff',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: 'pointer',
          zIndex: 1100,
        }}
      >
        Logout
      </button>
      <div className="position-relative overflow-hidden" style={{ height: '300px' }}>
        <img
          src={accImg}
          alt="Account"
          className="img-fluid w-100 h-100 object-fit-cover"
          style={{ objectPosition: 'center' }}
        />
      </div>
      {/* User Details Section */}
      <div className="container mt-4 p-3 border rounded bg-light">
        <h4>User Details</h4>
        {profileLoading ? (
          <p>Loading user profile...</p>
        ) : profileError ? (
          <p>Error loading profile: {profileError}</p>
        ) : (
          <>
            <p><strong>Name:</strong> {userProfile?.name || 'N/A'}</p>
            <p><strong>Email:</strong> {userProfile?.Email || 'N/A'}</p>
            <p><strong>Role:</strong> {userProfile?.role || 'N/A'}</p>
            <p><strong>Account Created At:</strong> {formatDate(userProfile?.createdAt)}</p>
          </>
        )}
      </div>
      <div className="container mt-4">
        <ul className="nav nav-tabs" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`}
              type="button"
              role="tab"
              aria-selected={activeTab === 'orders'}
              onClick={() => setActiveTab('orders')}
            >
              Orders
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === 'address' ? 'active' : ''}`}
              type="button"
              role="tab"
              aria-selected={activeTab === 'address'}
              onClick={() => setActiveTab('address')}
            >
              Address
            </button>
          </li>
        </ul>
        <div className="tab-content p-3 border border-top-0">
          {activeTab === 'orders' && (
            <div
              className="tab-pane fade show active"
              role="tabpanel"
            >
              <h5>Your Orders</h5>
              {ordersLoading ? (
                <p>Loading orders...</p>
              ) : orderList.length === 0 ? (
                <p>No orders found.</p>
              ) : (
                <ul className="list-group">
                  {orderList.map((order) => (
                    <li key={order._id} className="list-group-item">
                      <strong>Order ID:</strong> {order._id} <br />
                      <strong>Status:</strong> {order.orderStatus} <br />
                      <strong>Total:</strong> ${order.totalAmount ? order.totalAmount.toFixed(2) : '0.00'}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          {activeTab === 'address' && (
            <div
              className="tab-pane fade show active"
              role="tabpanel"
            >
              <h5>Your Addresses</h5>
              {addressesLoading ? (
                <p>Loading addresses...</p>
              ) : addressList.length === 0 ? (
                <p>No addresses found.</p>
              ) : (
                <ul className="list-group">
                  {addressList.map((address) => (
                    <li key={address._id} className="list-group-item">
                      <strong>{address.name}</strong> <br />
                      {address.street} {address.city} {address.state} {address.zipCode} <br />
                      {address.country}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShoppingAccount;
