import { useContext, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaStar } from "react-icons/fa";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import api from "../../utils/api";
import EditBookingModal from "./EditBookingModal";
import { AuthContext } from "../Auth/AuthContext";
import ReviewModal from "./ReviewModal";
import DataVisualizationModal from "./DataVizualizationModal";
import { Helmet } from "react-helmet";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [cars, setCars] = useState({});
  const { currentUser } = useContext(AuthContext);
  const [isDataVizModalOpen, setIsDataVizModalOpen] = useState(false);
  const [deletingBookings, setDeletingBookings] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [reviewedCars, setReviewedCars] = useState(new Set()); // Temporary test
  const email = currentUser?.email;

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const checkReviewedCars = useCallback(
    async (carIds) => {
      if (!email || carIds.length === 0) return;

      try {
        const reviewedSet = new Set();

        for (const carId of carIds) {
          try {
            const response = await api.get(`/reviews/car/${carId}`);
            const reviews = response.data.data;
            const userReview = reviews.find(
              (review) => review.reviewer === email,
            );

            if (userReview) {
              reviewedSet.add(carId);
            }
          } catch (error) {
            console.error("Error checking reviews for car", carId, ":", error);
          }
        }

        setReviewedCars(reviewedSet);
      } catch (error) {
        console.error("Error checking reviewed cars:", error);
      }
    },
    [email],
  );

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get("/bookings/user", {
          params: { email },
        });
        setBookings(response.data.data);
        setLoading(false);
        const carIds = response.data.data.map((booking) => booking.carId);
        fetchCarDetails(carIds);
        checkReviewedCars(carIds);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching bookings:", error);
      }
    };

    if (email) fetchBookings();
  }, [email, checkReviewedCars]);

  const fetchCarDetails = async (carIds) => {
    try {
      const carDataPromises = carIds.map((carId) => api.get(`/cars/${carId}`));
      const carDataResponses = await Promise.all(carDataPromises);
      const carDetails = {};
      carDataResponses.forEach((response) => {
        if (response.data.data && response.data.data._id) {
          carDetails[response.data.data._id] = response.data.data;
        }
      });
      setCars(carDetails);
    } catch (error) {
      console.error("Error fetching car details:", error);
    }
  };

  const handleEdit = (booking) => {
    setSelectedBooking(booking);
    setIsEditModalOpen(true);
  };

  const handleReview = (bookingId) => {
    setSelectedBooking(bookingId);
    setIsReviewModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedBooking(null);
  };

  const handleReviewSubmitted = (carId) => {
    setReviewedCars((prev) => new Set([...prev, carId]));
  };

  const handleBookingUpdated = (bookingId, updatedData) => {
    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking._id === bookingId ? { ...booking, ...updatedData } : booking,
      ),
    );
  };

  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
    setSelectedBooking(null);
  };

  const handleCancel = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Cancel it!",
      cancelButtonText: "Cancel",
      customClass: {
        confirmButton: "bg-red-500",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await api.patch(`/bookings/${id}/status`, {
            action: "cancel",
          });
          if (response.data.success) {
            // Update the booking status in local state
            setBookings((prevBookings) =>
              prevBookings.map((booking) =>
                booking._id === id
                  ? { ...booking, status: "Canceled" }
                  : booking,
              ),
            );
            Swal.fire(
              "Cancelled!",
              "The booking has been cancelled.",
              "success",
            );
          }
        } catch (error) {
          console.error("Error canceling booking:", error);
          let errorMessage = "Failed to cancel the booking.";

          if (error.response) {
            const { status, data } = error.response;

            if (status === 401) {
              errorMessage = "You need to be logged in to cancel bookings.";
            } else if (status === 403) {
              errorMessage =
                "You don't have permission to cancel this booking.";
            } else if (status === 404) {
              errorMessage = "Booking not found.";
            } else if (status === 400) {
              errorMessage = data.error || "Invalid cancellation request.";
            } else if (data.error) {
              errorMessage = data.error;
            }
          } else if (error.message) {
            errorMessage = error.message;
          }

          Swal.fire("Error", errorMessage, "error");
        }
      }
    });
  };
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete it!",
      cancelButtonText: "Delete",
      customClass: {
        confirmButton: "bg-red-500",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        setDeletingBookings((prev) => new Set(prev).add(id));
        try {
          const response = await api.delete(`/bookings/${id}`);
          if (response.data.success) {
            setBookings((prevBookings) =>
              prevBookings.filter((booking) => booking._id !== id),
            );
            Swal.fire("Deleted!", "The booking has been deleted.", "success");
          }
        } catch (error) {
          console.error("Error deleting booking:", error);
          let errorMessage = "Failed to delete the booking.";

          if (error.response) {
            const { status, data } = error.response;

            if (status === 401) {
              errorMessage = "You need to be logged in to delete bookings.";
            } else if (status === 403) {
              errorMessage =
                "You don't have permission to delete this booking.";
            } else if (status === 404) {
              errorMessage = "Booking not found.";
            } else if (status === 400) {
              errorMessage = data.error || "Invalid delete request.";
            } else if (data.error) {
              errorMessage = data.error;
            }
          } else if (error.message) {
            errorMessage = error.message;
          }

          Swal.fire("Error", errorMessage, "error");
        } finally {
          setDeletingBookings((prev) => {
            const newSet = new Set(prev);
            newSet.delete(id);
            return newSet;
          });
        }
      }
    });
  };

  if (bookings.length === 0 && !loading) {
    return (
      <div className="text-center py-16 min-h-screen">
        <h2 className="text-3xl font-bold mb-4">No Bookings Yet</h2>
        <Link
          to="/available-cars"
          className="px-6 py-3 bg-yellow-500 text-gray-900 font-semibold rounded-lg hover:bg-yellow-400 transition-all duration-300"
        >
          Make Your First Booking
        </Link>
      </div>
    );
  }

  const openDataVizModal = () => {
    setIsDataVizModalOpen(true);
  };

  const closeDataVizModal = () => {
    setIsDataVizModalOpen(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-16 min-h-screen px-4">
        <Helmet>
          <meta charSet="utf-8" />
          <title>Gari Chai - My Bookings</title>
        </Helmet>
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
          <div className="h-8 bg-gray-300 rounded w-40 animate-pulse"></div>
          <div className="h-10 bg-gray-300 rounded w-32 animate-pulse"></div>
        </div>

        {/* Table Skeleton */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow shadow">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="px-6 py-3">
                  <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
                </th>
                <th className="px-6 py-3">
                  <div className="h-4 bg-gray-300 rounded w-16 animate-pulse"></div>
                </th>
                <th className="px-6 py-3">
                  <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
                </th>
                <th className="px-6 py-3">
                  <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
                </th>
                <th className="px-6 py-3 table-cell">
                  <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
                </th>
                <th className="px-6 py-3">
                  <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
                </th>
                <th className="px-6 py-3">
                  <div className="h-4 bg-gray-300 rounded w-12 animate-pulse"></div>
                </th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, index) => (
                <tr
                  key={index}
                  className={`hover:bg-gray-100 ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="w-12 h-12 bg-gray-300 rounded-md animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-300 rounded w-32 animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-300 rounded w-16 animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 table-cell">
                    <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 table-cell">
                    <div className="h-4 bg-gray-300 rounded w-16 animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 flex space-x-4 items-center">
                    <div className="h-8 bg-gray-300 rounded w-20 animate-pulse"></div>
                    <div className="h-8 bg-gray-300 rounded w-24 animate-pulse"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-16 min-h-screen px-4">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Gari Chai - My Bookings</title>
      </Helmet>
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <button
          className="px-4 py-2 bg-yellowSecondary text-gray-800 rounded-lg hover:bg-yellowPrimary transition"
          onClick={openDataVizModal}
        >
          Vizualize Data
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow shadow">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="px-6 py-3">Car Image</th>
              <th className="px-6 py-3">Car Model</th>
              <th className="px-6 py-3">Booking Dates</th>
              <th className="px-6 py-3">Total Price</th>
              <th className="px-6 py-3 table-cell">Booking Date</th>
              <th className="px-6 py-3">Booking Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr
                key={booking.id}
                className={`hover:bg-gray-100 ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <td className="px-6 py-4">
                  <img
                    src={booking.carImageUrl || "https://placehold.co/400"}
                    alt={booking.carModel || "Car Image"}
                    className="w-12 h-12 object-cover rounded-md aspect-video"
                  />
                </td>
                <td className="px-6 py-4">
                  {booking.carModel || "Loading..."}
                </td>
                <td className="px-6 py-4">
                  {formatDate(booking.startDate)} -{" "}
                  {formatDate(booking.endDate)}
                </td>
                <td className="px-6 py-4">${booking.totalPrice}</td>
                <td className="px-6 py-4 table-cell">
                  {formatDate(booking.createdAt)}
                </td>
                <td
                  className={`px-6 py-4 table-cell ${
                    booking.status === "Confirmed"
                      ? "text-green-500"
                      : booking.status === "Pending"
                        ? "text-yellow-600"
                        : booking.status === "Canceled"
                          ? "text-red-500"
                          : ""
                  }`}
                >
                  {booking.status}
                </td>

                <td className="px-6 py-4 flex space-x-4 items-center">
                  {booking.status === "Confirmed" ? (
                    reviewedCars.has(booking.carId) ? (
                      <button
                        disabled
                        className="px-4 py-2 bg-gray-500 text-white rounded cursor-not-allowed flex items-center justify-center gap-1"
                      >
                        <FaStar /> Reviewed
                      </button>
                    ) : (
                      <button
                        onClick={() => handleReview(booking)}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-400 flex items-center justify-center gap-1"
                      >
                        <FaStar /> Review
                      </button>
                    )
                  ) : booking.status === "Canceled" ? (
                    <button
                      onClick={() => handleDelete(booking._id)}
                      disabled={deletingBookings.has(booking._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-400 flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deletingBookings.has(booking._id) ? (
                        <>
                          <div className="loading loading-spinner loading-sm"></div>
                          Deleting...
                        </>
                      ) : (
                        <>
                          <FaTrash /> Delete
                        </>
                      )}
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(booking)}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-400 flex items-center justify-center gap-1"
                      >
                        <FaEdit /> Modify Date
                      </button>
                      <button
                        onClick={() => handleCancel(booking._id)}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-400 flex items-center justify-center gap-1"
                      >
                        <FaTrash /> Cancel Booking
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isEditModalOpen && selectedBooking && (
        <EditBookingModal
          bookingData={selectedBooking}
          closeModal={closeEditModal}
          onBookingUpdated={handleBookingUpdated}
        />
      )}

      {isReviewModalOpen && selectedBooking && (
        <ReviewModal
          bookingId={selectedBooking}
          closeModal={closeReviewModal}
          onReviewSubmitted={handleReviewSubmitted}
        />
      )}
      {isDataVizModalOpen && (
        <DataVisualizationModal
          closeModal={closeDataVizModal}
          bookings={bookings}
          cars={cars}
        />
      )}
    </div>
  );
};

export default MyBookings;
