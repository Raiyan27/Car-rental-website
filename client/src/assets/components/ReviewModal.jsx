import React, { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import { FaTimes } from "react-icons/fa";
import api from "../../utils/api";
import { AuthContext } from "../Auth/AuthContext";

const ReviewModal = ({ bookingId, closeModal }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [carInfo, setCarInfo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const reviewerName = currentUser?.displayName;
  const photo = currentUser?.photoURL;

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const carId = bookingId.carId;
        const response = await api.get(`/cars/${carId}`);

        if (response.data.success) {
          setCarInfo(response.data.data);
        } else {
          Swal.fire("Error", "Car details not found", "error");
        }
      } catch (error) {
        console.error("Error fetching car details:", error);
        Swal.fire("Error", "Failed to fetch car details", "error");
      }
    };

    if (bookingId?.carId) {
      fetchCarDetails();
    }
  }, [bookingId]);

  const handleStarClick = (star) => {
    setRating(star);
  };

  const handleReviewChange = (event) => {
    setReviewText(event.target.value);
  };

  const handleSubmitReview = async () => {
    if (rating === 0 || !reviewText.trim()) {
      Swal.fire("Error", "Please provide a rating and a review text.", "error");
      return;
    }

    if (reviewText.trim().length < 10) {
      Swal.fire(
        "Error",
        "Review must be at least 10 characters long.",
        "error",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post("/reviews", {
        car: bookingId.carId,
        booking: bookingId._id,
        rating,
        comment: reviewText,
      });

      if (response.data.success) {
        Swal.fire("Success", "Your review has been submitted!", "success");
        closeModal();
      } else {
        Swal.fire(
          "Error",
          response.data.error || "Failed to submit the review",
          "error",
        );
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      Swal.fire("Error", "Failed to submit the review.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 ">
      <div className="bg-white max-h-[400px] sm:max-h-[600px] p-8 rounded-lg max-w-md w-full mx-4 mt-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Review Your Booking</h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {carInfo ? (
          <>
            <div className="mb-6">
              <label className="block text-lg font-medium">Model:</label>
              <p className="text-gray-700">{carInfo.model}</p>
            </div>

            <div className="mb-6">
              <label className="block text-lg font-medium">Owner:</label>
              <p className="text-gray-700">{carInfo.user.name}</p>
            </div>

            <div className="mb-6">
              <label className="block text-lg font-medium">
                Rate the Service:
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`cursor-pointer text-xl ${
                      star <= rating ? "text-yellow-500" : "text-gray-300"
                    }`}
                    onClick={() => handleStarClick(star)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-lg font-medium">
                Write a Review:
              </label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg"
                rows="4"
                value={reviewText}
                onChange={handleReviewChange}
                placeholder="Write your review here (minimum 10 characters)..."
              ></textarea>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={handleSubmitReview}
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Submitting...
                  </>
                ) : (
                  "Submit Review"
                )}
              </button>
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">Loading car details...</div>
        )}
      </div>
    </div>
  );
};

export default ReviewModal;
