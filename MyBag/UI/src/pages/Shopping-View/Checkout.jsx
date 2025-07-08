import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Address from "../../Components/shopping/Address.jsx";
import img from "../../assets/account.jpg";
import UserCartItemsContent from "../../Components/shopping/cart-items-content";
import { Button, ToastBody, ToastHeader } from "react-bootstrap";
import { createNewOrder } from "../../store/admin/order-slice/orderSlice";
import { fetchCartItems, clearCartAsync, deleteCartItem } from "../../store/cart-slice/cart-Slice";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const adminOrdersState = useSelector((state) => state.adminOrders);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymemntStart] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.userId) {
      console.log("Fetching cart items for user:", user.userId);
      dispatch(fetchCartItems(user.userId));
    }
  }, [dispatch, user]);

  useEffect(() => {
    console.log("Checkout auth state:", { user, isAuthenticated });
  }, [user, isAuthenticated]);

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  async function handleInitiatePayment() {
    if (!cartItems || cartItems.length === 0) {
      toast.error("Your cart is empty. Please add items to proceed");
      return;
    }
    if (currentSelectedAddress === null) {
      toast.error("Please select one address to proceed.");
      return;
    }

    const orderData = {
      userId: user?.userId,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "none",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };

    dispatch(createNewOrder(orderData)).then(async (data) => {
      if (data?.payload?.success) {
        toast.success("Order created successfully.");
        try {
          const cartId = cartItems._id;
            const clearCartUrl = `https://mybag-server-mern.onrender.com/api/shop/cart/clear/${cartId}`;
            console.log("Calling clear cart API:", clearCartUrl);
            const response = await axios.delete(clearCartUrl);
            console.log("Clear cart response:", response);
            if (response.status === 200 && response.data.success) {
              dispatch(clearCartAsync(cartId));
              dispatch(fetchCartItems(user.userId));
            } else {
              toast.error("Failed to clear cart.");
            }
        } catch (error) {
          console.error("Error clearing cart:", error);
          toast.error("Error clearing cart.");
        }
        setIsPaymemntStart(false);
      } else {
        toast.error("Failed to create order.");
        setIsPaymemntStart(false);
      }
    });
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="d-flex flex-column">
      <div
        className="position-relative"
        style={{ height: "300px", width: "100%", overflow: "hidden" }}
      >
        <img
          src={img}
          alt="Account"
          className="h-100 w-100 object-fit-cover object-position-center"
        />
      </div>
      <div className="row row-cols-1 row-cols-sm-2 g-3 mt-3 p-3">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        <div className="d-flex flex-column" style={{maxHeight: '400px', overflowY: 'auto'}}>
          {cartItems && cartItems.items && cartItems.items.length > 0
            ? cartItems.items.map((item) => (
                <UserCartItemsContent
                  cartItem={item}
                  key={item.productId || item._id}
                />
              ))
            : null}
          <div className="mt-4">
            <div className="d-flex justify-content-between">
              <span className="fw-bold" style={{textDecoration: "underline",
  textDecorationColor: "rgba(222, 155, 0, 0.8)"}}>Total</span>
              <span className="fw-bold">${totalCartAmount}</span>
            </div>
          </div>
          <div className="mt-3 w-100">
            <Button
              onClick={handleInitiatePayment}
              className="w-100"
              variant="dark"
              disabled={isPaymentStart}
            >
              Place Order
            </Button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default ShoppingCheckout;
