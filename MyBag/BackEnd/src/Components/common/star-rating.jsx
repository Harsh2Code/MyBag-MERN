import { StarIcon } from "lucide-react";

function StarRatingComponent({ rating, handleRatingChange }) {
  console.log(rating, "rating");

  return [1, 2, 3, 4, 5].map((star) => (
    <button
      type="button"
      className={`btn btn-outline-warning rounded-circle p-2 me-1 ${
        star <= rating ? "text-warning" : "text-dark"
      }`}
      onClick={handleRatingChange ? () => handleRatingChange(star) : null}
      key={star}
    >
      <StarIcon
        className= {` ${star <= rating ? "fill-current" : "fill-dark"}`}
      />
    </button>
  ));
}

export default StarRatingComponent;