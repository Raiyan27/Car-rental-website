import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { format } from "date-fns"; // Import date-fns for date formatting

const ShowReviewsModal = ({ carId, closeModal }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/reviews/${carId}`
        );
        setReviews(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        Swal.fire("Error", "Failed to load reviews", "error");
        setLoading(false);
      }
    };
    fetchReviews();
  }, [carId]);

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg max-w-lg w-full shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Car Reviews</h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="text-center text-gray-600">Loading reviews...</div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review._id} className="mb-6 border-b pb-4">
                  <div className="flex items-center mb-2">
                    <div className="font-semibold text-lg text-gray-800">
                      {review.reviewer}
                    </div>
                    <div className="ml-2 text-yellow-500">
                      {`★`.repeat(review.rating)}
                    </div>
                  </div>
                  <div className="text-gray-500 text-sm mb-2">
                    <div className="font-medium text-gray-600">
                      Owner: {review.owner}
                    </div>
                    <div className="text-gray-400">
                      Review Date:{" "}
                      {format(new Date(review.createdAt), "MMMM dd, yyyy")}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-2">{review.comment}</p>
                </div>
              ))
            ) : (
              <div className="text-gray-600">No reviews yet.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowReviewsModal;
