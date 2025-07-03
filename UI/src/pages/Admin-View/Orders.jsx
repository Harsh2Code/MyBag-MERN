import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../../store/admin/order-slice/orderSlice";
import { Modal, Button, Table, Badge } from "react-bootstrap";
import AdminOrderDetailsView from "../../Components/admin-view/order-details";

function AdminOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { orders, isLoading, error } = useSelector((state) => state.adminOrders);
  const dispatch = useDispatch();

  function handleShowOrderDetails(order) {
    setSelectedOrder(order);
    setOpenDetailsDialog(true);
  }

  function handleCloseDetailsDialog() {
    setOpenDetailsDialog(false);
    setSelectedOrder(null);
    dispatch(fetchOrders());
  }

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  return (
    <div className="admin-main">
      <h2>All Orders</h2>
      {isLoading && <p>Loading orders...</p>}
      {error && <p className="text-danger">{error}</p>}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Order Date</th>
            <th>Order Status</th>
            <th>Order Price</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {orders && orders.length > 0
            ? orders.map((orderItem) => {
                const orderDate = orderItem?.orderDate;
                const displayDate =
                  typeof orderDate === "string" && orderDate.includes("T")
                    ? orderDate.split("T")[0]
                    : "N/A";
                return (
                  <tr key={orderItem?._id}>
                    <td>{orderItem?._id}</td>
                    <td>{displayDate}</td>
                    <td>
                      <Badge
                        bg={
                          orderItem?.orderStatus === "confirmed"
                            ? "success"
                            : orderItem?.orderStatus === "rejected"
                            ? "danger"
                            : "dark"
                        }
                        className="py-1 px-3"
                      >
                        {orderItem?.orderStatus}
                      </Badge>
                    </td>
                    <td>${orderItem?.totalAmount}</td>
                    <td>
                      <Button
                        variant="primary"
                        onClick={() => handleShowOrderDetails(orderItem)}
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                );
              })
            : null}
        </tbody>
      </Table>

      <Modal
        show={openDetailsDialog}
        onHide={handleCloseDetailsDialog}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AdminOrderDetailsView orderDetails={selectedOrder} onStatusUpdated={() => dispatch(fetchOrders())} />
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default AdminOrdersView;
