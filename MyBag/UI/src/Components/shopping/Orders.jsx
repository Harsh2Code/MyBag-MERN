import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ShoppingOrderDetailsView from "./order-details";
import {
  getAllOrdersByUserId,
  getOrderDetails,
  resetOrderDetails,
} from "../../store/Shop/Order-Slice/OrderSlice";

const ShoppingOrders = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, authChecked } = useSelector((state) => state.auth);
  const { orderList, orderDetails, isLoading } = useSelector((state) => state.shoppingOrder);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [ordersFetched, setOrdersFetched] = useState(false);

  useEffect(() => {
    if (authChecked && isAuthenticated && user?._id && !ordersFetched) {
      dispatch(getAllOrdersByUserId());
      setOrdersFetched(true);
    }
  }, [authChecked, isAuthenticated, user, ordersFetched, dispatch]);

  useEffect(() => {
    if (orderDetails !== null) {
      setOpenDetailsDialog(true);
    }
  }, [orderDetails]);

  const handleFetchOrderDetails = (orderId) => {
    dispatch(getOrderDetails(orderId));
  };

  const handleCloseDetails = () => {
    setOpenDetailsDialog(false);
    dispatch(resetOrderDetails());
  };

  if (isLoading && !ordersFetched) {
    return <div>Loading orders...</div>;
  }

  return (
    <div className="card mt-5">
      <div className="card-header">
        <h5 className="card-title">Order History</h5>
      </div>
      <div className="card-body">
        {orderList && orderList.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Order Date</th>
                <th>Order Status</th>
                <th>Order Price</th>
                <th>
                  <span className="visually-hidden">Details</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {orderList.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{new Date(order.orderDate).toISOString().split("T")[0]}</td>
                  <td>
                    <span
                      className={`badge py-1 px-3 ${
                        order.orderStatus === "confirmed"
                          ? "bg-success"
                          : order.orderStatus === "rejected"
                          ? "bg-danger"
                          : "bg-dark"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td>${order.totalAmount}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-dark"
                      onClick={() => handleFetchOrderDetails(order._id)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No orders found.</p>
        )}
      </div>

      {openDetailsDialog && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          aria-labelledby="orderDetailsModalLabel"
          aria-modal="true"
          role="dialog"
          onClick={handleCloseDetails}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="orderDetailsModalLabel">
                  Order Details
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={handleCloseDetails}
                ></button>
              </div>
              <div className="modal-body">
                <ShoppingOrderDetailsView orderDetails={orderDetails} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingOrders;
