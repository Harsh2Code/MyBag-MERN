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
        className='btn btn-dark btn-outline-warning'
        onClick={handleLogout}
        style={{
          position: 'absolute',
          top: '38px',
          right: '10px',
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
        <h4 style={{
          textDecoration: "underline",
          textDecorationColor: "rgba(222, 155, 0, 0.8)"
        }}>User Details</h4>
        {profileLoading ? (
          <p>Loading user profile...</p>
        ) : profileError ? (
          <>
            <p>Error loading profile: {profileError}</p>
            <pre>{JSON.stringify(profileError, null, 2)}</pre>
          </>
        ) : userProfile ? (
          <table className="table table-bordered table-striped" style={{ width: '50%', textAlign: 'left', margin: "auto" }}>
            <tbody>
              <tr>
                <th style={{ textDecoration: "underline", textDecorationColor: "rgba(222, 155, 0, 0.8)", textAlign: 'left' }}>Name</th>
                <td style={{ textAlign: 'left' }}>{userProfile.name || 'N/A'}</td>
              </tr>
              <tr>
                <th style={{ textDecoration: "underline", textDecorationColor: "rgba(222, 155, 0, 0.8)", textAlign: 'left' }}>Email</th>
                <td style={{ textAlign: 'left' }}>{userProfile.Email || 'N/A'}</td>
              </tr>
              <tr>
                <th style={{ textDecoration: "underline", textDecorationColor: "rgba(222, 155, 0, 0.8)", textAlign: 'left' }}>Role</th>
                <td style={{ textAlign: 'left' }}>{userProfile.role || 'N/A'}</td>
              </tr>
              <tr>
                <th style={{ textDecoration: "underline", textDecorationColor: "rgba(222, 155, 0, 0.8)", textAlign: 'left' }}>Account Created At</th>
                <td style={{ textAlign: 'left' }}>{formatDate(userProfile.createdAt)}</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p>User profile data is not available.</p>
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
              style={{
                textDecoration: "underline",
                textDecorationColor: "rgba(222, 155, 0, 0.8)", color: "black"
              }}
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
              style={{
                textDecoration: "underline",
                textDecorationColor: "rgba(222, 155, 0, 0.8)", color: "black"
              }}
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
                      <table className='table table-striped' style={{width: "50%", textAlign:"left"}}>
                        <tr>
                          <th><strong>Order ID:</strong></th> <td>{order._id}</td>
                        </tr>
                        <tr>
                          <th><strong>Status:</strong></th> <td>{order.orderStatus}</td>
                        </tr>
                        <tr><th><strong>Total:</strong></th> <td>${order.totalAmount ? order.totalAmount.toFixed(2) : '0.00'}</td></tr>
                      </table>
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
              <h5 style={{
                textDecoration: "underline",
                textDecorationColor: "rgba(222, 155, 0, 0.8)"
              }}>Your Addresses</h5>
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
