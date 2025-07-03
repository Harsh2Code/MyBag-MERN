import React, { useEffect, useState } from "react";
import { StarIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "../../store/cart-slice/cart-Slice";
import StarRatingComponent from '../common/star-rating';
import { Modal, Button, Toast, ToastContainer } from "react-bootstrap";
import axios from "axios";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [rating, setRating] = useState(0);
  const [reviewMsg, setReviewMsg] = useState("");
  const [reviews, setReviews] = useState([]);
  const [averageReview, setAverageReview] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  console.log("Current user in auth state:", user);
  const { cartItems } = useSelector((state) => state.shopCart);
  const backendBaseUrl = process.env.VITE_BACKEND_URL || "";

  useEffect(() => {
    if (productDetails?._id) {
      fetchReviews();
    }
  }, [productDetails]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${backendBaseUrl}/api/shop/products/review/${productDetails._id}`);
      if (response.data.success) {
        setReviews(response.data.data.reviews);
        setAverageReview(response.data.data.averageRating);
      }
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    }
  };

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          setToastMessage(`Only ${getQuantity} quantity can be added for this item`);
          setShowToast(true);
          return;
        }
      }
    }
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        setToastMessage("Product is added to cart");
        setShowToast(true);
      }
    });
  }

  function handleDialogClose() {
    setOpen(false);
    setRating(0);
    setReviewMsg("");
  }

  const handleReviewMsgChange = (e) => {
    setReviewMsg(e.target.value);
  };

  const handleSubmitReview = async () => {
    if (!user) {
      setToastMessage("Please login to submit a review");
      setShowToast(true);
      return;
    }
    if (rating === 0) {
      setToastMessage("Please provide a rating");
      setShowToast(true);
      return;
    }
    console.log("Submitting review with userId:", user.id, "rating:", rating, "reviewText:", reviewMsg);
    try {
      const response = await axios.post(`${backendBaseUrl}/api/shop/products/review/${productDetails._id}`, {
        userId: user.userId,
        rating,
        reviewText: reviewMsg,
      });
      if (response.data.success) {
        setToastMessage("Review submitted successfully");
        setShowToast(true);
        setRating(0);
        setReviewMsg("");
        fetchReviews();
      }
    } catch (error) {
      setToastMessage("Failed to submit review");
      setShowToast(true);
    }
  };

  return (
    <>
      <Modal show={open} onHide={handleDialogClose} size="lg" centered>
        <Modal.Body>
          <div className="row">
            <div className="col-md-6">
              <img
                src={productDetails?.image}
                alt={productDetails?.title}
                className="img-fluid rounded"
              />
            </div>
            <div className="col-md-6">
              <h1 className="mb-3">{productDetails?.title}</h1>
              <p className="text-muted mb-4">{productDetails?.description}</p>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <p className={`h3 ${productDetails?.salePrice > 0 ? "text-decoration-line-through" : ""} text-primary mb-0`}>
                  ${productDetails?.price}
                </p>
                {productDetails?.salePrice > 0 && (
                  <p className="h4 text-muted mb-0">${productDetails?.salePrice}</p>
                )}
              </div>
              <div className="d-flex align-items-center mb-3">
                <StarIcon className="text-warning me-2" />
                <StarRatingComponent rating={averageReview} />
                <span className="ms-2 text-muted">({averageReview.toFixed(2)})</span>
              </div>
              <div className="mb-4">
                {productDetails?.totalStock === 0 ? (
                  <Button variant="secondary" disabled className="w-100">
                    Out of Stock
                  </Button>
                ) : (
                  <Button
                    variant="dark"
                    className="w-100"
                    onClick={() =>
                      handleAddToCart(productDetails?._id, productDetails?.totalStock)
                    }
                  >
                    Add to Cart
                  </Button>
                )}
              </div>
              <hr />
              <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                <h2 className="h5 mb-3">Reviews</h2>
                {reviews.length === 0 ? (
                  <div>No Reviews</div>
                ) : (
                  reviews.map((review) => (
                    <div key={review._id} className="mb-3 border-bottom pb-2">
                      <strong>{review.userId?.username || "Anonymous"}</strong>
                      <div className="d-flex align-items-center mb-1">
                        <StarRatingComponent rating={review.rating} />
                        <span className="ms-2 text-muted">{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p>{review.reviewText}</p>
                    </div>
                  ))
                )}
                <div className="mt-4">
                  <label>Write a review</label>
                  <div className="d-flex gap-2 align-items-center mb-2">
                    <StarRatingComponent rating={rating} handleRatingChange={handleRatingChange} />
                  </div>
                  <textarea
                    name="reviewMsg"
                    value={reviewMsg}
                    onChange={handleReviewMsgChange}
                    placeholder="Write a review..."
                    className="form-control mb-2"
                  />
                  <Button
                    variant="dark"
                    onClick={handleSubmitReview}
                    disabled={rating === 0 || reviewMsg.trim() === ""}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <ToastContainer position="top-end" className="p-3">
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
          bg="info"
        >
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}

export default ProductDetailsDialog;
