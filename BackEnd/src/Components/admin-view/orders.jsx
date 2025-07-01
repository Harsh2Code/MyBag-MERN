import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../../store/admin/order-slice/orderSlice";
import AdminOrderDetailsView from "./order-details";

function AdminOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { orders, isLoading, error } = useSelector((state) => state.adminOrders);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("AdminOrdersView useEffect dispatching fetchOrders");
    dispatch(fetchOrders());
  }, [dispatch]);

  console.log("AdminOrdersView orders:", orders);

  function handleShowOrderDetails(order) {
    setSelectedOrder(order);
    setOpenDetailsDialog(true);
  }

  function handleCloseDetailsDialog() {
    setOpenDetailsDialog(false);
    setSelectedOrder(null);
    dispatch(fetchOrders());
  }

  return (
    <div className="card">
      <div className="card-header">
        <h5>All Orders</h5>
      </div>
      <div className="card-body p-0">
        {isLoading && <p>Loading orders...</p>}
        {error && <p className="text-danger">{error}</p>}
        <table className="table mb-0">
          <thead className="table-light">
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
            {orders && orders.length > 0
              ? orders.map((orderItem) => (
                  <tr key={orderItem?._id}>
                    <td>{orderItem?._id}</td>
                    <td>{orderItem?.orderDate.split("T")[0]}</td>
                    <td>
                      <span
                        className={`badge ${
                          orderItem?.orderStatus === "confirmed"
                            ? "bg-success"
                            : orderItem?.orderStatus === "rejected"
                            ? "bg-danger"
                            : "bg-dark"
                        } py-1 px-3`}
                      >
                        {orderItem?.orderStatus}
                      </span>
                    </td>
                    <td>${orderItem?.totalAmount}</td>
                    <td>
                      <>
                        <button
                          className="btn btn-dark btn btn-dark-primary btn btn-dark-sm"
                          onClick={() => handleShowOrderDetails(orderItem)}
                        >
                          View Details
                        </button>
                        {openDetailsDialog && selectedOrder === orderItem && (
                          <div
                            className="modal show d-block"
                            tabIndex="-1"
                            role="dialog"
                            onClick={handleCloseDetailsDialog}
                          >
                            <div
                              className="modal-dialog modal-lg"
                              role="document"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="modal-content">
                                <div className="modal-header">
                                  <h5 className="modal-title">Order Details</h5>
                                  <button
                                    type="button"
                                    className="btn btn-dark-close"
                                    aria-label="Close"
                                    onClick={handleCloseDetailsDialog}
                                  ></button>
                                </div>
                                <div className="modal-body">
                                  <AdminOrderDetailsView orderDetails={selectedOrder} />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    </td>
                  </tr>
                ))
              : !isLoading && (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No orders found
                    </td>
                  </tr>
                )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminOrdersView;
