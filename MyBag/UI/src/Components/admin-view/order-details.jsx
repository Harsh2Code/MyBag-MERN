import { useSelector, useDispatch } from "react-redux";
import { Badge, Form } from "react-bootstrap";
import { useState } from "react";
import { updateOrderStatus } from "../../store/admin/order-slice/orderSlice";

function AdminOrderDetailsView({ orderDetails, onStatusUpdated }) {
  const { user } = useSelector((state) => state.auth);
  const [orderStatus, setOrderStatus] = useState(orderDetails?.orderStatus || "");
  const dispatch = useDispatch();

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setOrderStatus(newStatus);
    try {
      await dispatch(updateOrderStatus({ orderId: orderDetails._id, status: newStatus })).unwrap();
      if (onStatusUpdated) {
        onStatusUpdated();
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      // Optionally revert the status change or show error message
    }
  };

  const getBadgeVariant = (status) => {
    switch (status) {
      case "confirmed":
        return "success";
      case "rejected":
        return "danger";
      default:
        return "dark";
    }
  };

  return (
    <div className="modal-body">
      <div className="container">
        <div className="row g-3">
          <div className="col-12 d-flex justify-content-between align-items-center mt-3">
            <p className="fw-medium mb-0">Order ID</p>
            <span>{orderDetails?._id}</span>
          </div>
          <div className="col-12 d-flex justify-content-between align-items-center mt-2">
            <p className="fw-medium mb-0">Order Date</p>
            <span>{orderDetails?.orderDate.split("T")[0]}</span>
          </div>
          <div className="col-12 d-flex justify-content-between align-items-center mt-2">
            <p className="fw-medium mb-0">Order Price</p>
            <span>${orderDetails?.totalAmount}</span>
          </div>
          <div className="col-12 d-flex justify-content-between align-items-center mt-2">
            <p className="fw-medium mb-0">Payment method</p>
            <span>{orderDetails?.paymentMethod}</span>
          </div>
          <div className="col-12 d-flex justify-content-between align-items-center mt-2">
            <p className="fw-medium mb-0">Payment Status</p>
            <span>{orderDetails?.paymentStatus}</span>
          </div>
          <div className="col-12 d-flex justify-content-between align-items-center mt-2">
            <p className="fw-medium mb-0">Order Status</p>
            <Badge
              bg={getBadgeVariant(orderStatus)}
              className="py-1 px-3 ms-2"
            >
              {orderStatus}
            </Badge>
          </div>
        </div>
        <hr />
        <div className="row g-4">
          <div className="col-12">
            <div className="fw-medium mb-2">Order Details</div>
            <ul className="list-unstyled">
              {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
                ? orderDetails?.cartItems.map((item) => (
                    <li
                      key={item.title}
                      className="d-flex justify-content-between mb-1"
                    >
                      <span>Title: {item.title}</span>
                      <span>Quantity: {item.quantity}</span>
                      <span>Price: ${item.price}</span>
                    </li>
                  ))
                : null}
            </ul>
          </div>
        </div>
        <div className="row g-4">
          <div className="col-12">
            <div className="fw-medium mb-2">Shipping Info</div>
            <div className="text-muted">
              <span>{user ? user.userName : "Unknown User"}</span><br />
              <span>{orderDetails?.addressInfo?.address}</span><br />
              <span>{orderDetails?.addressInfo?.city}</span><br />
              <span>{orderDetails?.addressInfo?.pincode}</span><br />
              <span>{orderDetails?.addressInfo?.phone}</span><br />
              <span>{orderDetails?.addressInfo?.notes}</span>
            </div>
          </div>
        </div>
      </div>
      <Form.Select
        value={orderStatus}
        onChange={handleStatusChange}
        className="container  text-center"
      >
        <option value="pending">pending</option>
        <option value="confirmed">confirmed</option>
        <option value="rejected">rejected</option>
      </Form.Select>
    </div>
  );
}

export default AdminOrderDetailsView;
