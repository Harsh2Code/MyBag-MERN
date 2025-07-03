import { useSelector } from "react-redux";
import { Badge } from "react-bootstrap";

function ShoppingOrderDetailsView({ orderDetails }) {
  const { user } = useSelector((state) => state.auth);

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
            <span>
              <Badge
                bg={
                  orderDetails?.orderStatus === "confirmed"
                    ? "success"
                    : orderDetails?.orderStatus === "rejected"
                    ? "danger"
                    : "dark"
                }
                className="py-1 px-3"
              >
                {orderDetails?.orderStatus}
              </Badge>
            </span>
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
              <span>{user.userName}</span><br />
              <span>{orderDetails?.addressInfo?.address}</span><br />
              <span>{orderDetails?.addressInfo?.city}</span><br />
              <span>{orderDetails?.addressInfo?.pincode}</span><br />
              <span>{orderDetails?.addressInfo?.phone}</span><br />
              <span>{orderDetails?.addressInfo?.notes}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingOrderDetailsView;
