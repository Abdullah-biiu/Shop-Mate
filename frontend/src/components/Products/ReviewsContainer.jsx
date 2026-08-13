import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Star } from "lucide-react";
import {
  deleteReview,
  postReview,
} from "../../store/slices/productSlice";

const ReviewsContainer = ({
  product,
  productReviews,
}) => {
  const { authUser } = useSelector(
    (state) => state.auth
  );

  const {
    isReviewDeleting,
    isPostingReview,
  } = useSelector((state) => state.product);

  const dispatch = useDispatch();

  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");

  const handleReviewSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append("rating", rating);
    data.append("comment", comment);

    dispatch(
      postReview({
        productId: product?._id || product?.id,
        review: data,
      })
    );

    setComment("");
    setRating(1);
  };

  return (
    <>
      {authUser && (
        <form
          onSubmit={handleReviewSubmit}
          className="mb-8 space-y-4"
        >
          <h4 className="text-lg font-semibold">
            Leave a Review
          </h4>

          {/* Rating Stars */}
          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() =>
                  setRating(i + 1)
                }
              >
                <Star
                  className={`w-7 h-7 transition ${
                    i < rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-400"
                  }`}
                />
              </button>
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(e) =>
              setComment(e.target.value)
            }
            rows={4}
            placeholder="Write your review..."
            className="w-full p-3 rounded-lg border border-border bg-background text-foreground"
          />

          <button
            type="submit"
            disabled={isPostingReview}
            className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {isPostingReview
              ? "Submitting..."
              : "Submit Review"}
          </button>
        </form>
      )}

      <h3 className="text-xl font-semibold text-foreground mb-6">
        Customer Reviews
      </h3>

      {productReviews &&
      productReviews.length > 0 ? (
        <div className="space-y-6">
          {productReviews.map((review) => (
            <div
              key={review.review_id}
              className="glass-card p-6"
            >
              <div className="flex items-start gap-4">
                <img
                  src={
                    review?.reviewer?.avatar
                      ?.url ||
                    "/avatar-holder.avif"
                  }
                  alt={
                    review?.reviewer?.name
                  }
                  className="w-12 h-12 rounded-full"
                />

                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h4 className="font-semibold text-foreground">
                      {
                        review?.reviewer
                          ?.name
                      }
                    </h4>

                    <div className="flex">
                      {[...Array(5)].map(
                        (_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i <
                              (review?.rating ||
                                0)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        )
                      )}
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-3">
                    {review?.comment}
                  </p>

                  {authUser?.id ===
                    review?.reviewer
                      ?.id && (
                    <button
                      onClick={() =>
                        dispatch(
                          deleteReview({
                            productId:
                              product?._id ||
                              product?.id,
                            reviewId:
                              review.review_id,
                          })
                        )
                      }
                      className="px-4 py-2 rounded-lg border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
                    >
                      {isReviewDeleting ? (
                        <span>
                          Deleting...
                        </span>
                      ) : (
                        "Delete Review"
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">
          No reviews yet. Be the
          first one to review this
          product.
        </p>
      )}
    </>
  );
};

export default ReviewsContainer;