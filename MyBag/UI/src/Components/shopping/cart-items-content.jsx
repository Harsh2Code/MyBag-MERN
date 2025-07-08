import { Minus, Plus, Trash } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "../../store/cart-slice/cart-Slice";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";

function UserCartItemsContent({ cartItem }) {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProducts);
  const dispatch = useDispatch();

  function handleUpdateQuantity(getCartItem, typeOfAction) {
    console.log("handleUpdateQuantity called with:", getCartItem, typeOfAction);
    if (typeOfAction === "minus" && getCartItem?.quantity === 1) {
      // Prevent reducing quantity below 1
      return;
    }

    if (typeOfAction == "plus") {
      let getCartItems = cartItems.items || [];

      if (getCartItems.length) {
        const indexOfCurrentCartItem = getCartItems.findIndex(
          (item) => item.productId === getCartItem?.productId
        );

        const getCurrentProductIndex = productList.findIndex(
          (product) => product._id === getCartItem?.productId
        );
        const getTotalStock = productList[getCurrentProductIndex].totalStock;

        if (indexOfCurrentCartItem > -1) {
          const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
          if (getQuantity + 1 > getTotalStock) {
            toast.error(`Only ${getQuantity} quantity can be added for this item`);
            return;
          }
        }
      }
    }

    dispatch(
      updateCartQuantity({
        userId: user?.userId,
        productId: getCartItem?.productId,
        quantity:
          typeOfAction === "plus"
            ? getCartItem?.quantity + 1
            : getCartItem?.quantity - 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast.success("Cart item is updated successfully");
      }
    });
  }

  function handleCartItemDelete(getCartItem) {
    dispatch(
      deleteCartItem({ userId: user?.userId, productId: getCartItem?.productId })
    ).then((data) => {
      if (data?.payload?.success) {
        toast.success("Cart item is deleted successfully");
        dispatch(fetchCartItems(user?.userId)); // Refresh cart items after deletion
      }
    });
  }

  return (
    <div className="d-flex align-items-center">
      <img
        src={cartItem?.image}
        alt={cartItem?.title}
        className="img-thumbnail"
        style={{ width: "80px", height: "80px", objectFit: "cover" }}
      />
      <div className="flex-grow-1 ms-3">
        <h5 className="fw-bold">{cartItem?.title}</h5>
        <div className="d-flex align-items-center gap-2 mt-1">
          <Button
            variant="outline-secondary"
            className="rounded-circle p-1"
            size="sm"
            disabled={cartItem?.quantity === 1}
            onClick={() => handleUpdateQuantity(cartItem, "minus")}
          >
            <Minus size={16} />
            <span className="visually-hidden">Decrease</span>
          </Button>
          <span className="fw-semibold">{cartItem?.quantity}</span>
          <Button
            variant="outline-secondary"
            className="rounded-circle p-1"
            size="sm"
            onClick={() => handleUpdateQuantity(cartItem, "plus")}
          >
            <Plus size={16} />
            <span className="visually-hidden">Increase</span>
          </Button>
        </div>
      </div>
      <div className="d-flex flex-column align-items-end ms-3">
        <p className="fw-semibold mb-1">
          $
          {(
            (cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) *
            cartItem?.quantity
          ).toFixed(2)}
        </p>
        <Trash
          onClick={() => handleCartItemDelete(cartItem)}
          className="text-danger cursor-pointer"
          size={20}
          style={{ cursor: "pointer" }}
        />
      </div>
    </div>
  );
}

export default UserCartItemsContent;
