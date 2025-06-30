import { useNavigate } from "react-router-dom";
import UserCartItemsContent from "./cart-items-content";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();

  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  return (
    <Modal show={true} centered>
      <Modal.Header>
        <Modal.Title>Your Cart</Modal.Title>
      </Modal.Header>
      <Modal.Body className="container">
        <div className="mt-4 mb-4">
          {cartItems && cartItems.length > 0
            ? cartItems.map((item) => <UserCartItemsContent key={item.productId} cartItem={item} />)
            : null}
        </div>
        <div className="mt-4 mb-4">
          <div className="d-flex justify-content-between">
            <span className="fw-bold">Total</span>
            <span className="fw-bold">${totalCartAmount}</span>
          </div>
        </div>
        <Button
          onClick={() => {
            navigate('/shop/checkout');
            setOpenCartSheet(false);
          }}
          className="w-100 mt-3"
          variant="primary"
        >
          Checkout
        </Button>
      </Modal.Body>
    </Modal>
  );
}

export default UserCartWrapper;