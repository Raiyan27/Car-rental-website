import React, { useContext, useState, useEffect } from "react";
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
  const [loading, setLoading] = useState(true);
  const email = currentUser?.email;

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

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
      } catch (error) {
        setLoading(false);
        console.error("Error fetching bookings:", error);
      }
    };

    if (email) fetchBookings();
  }, [email]);

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
            Swal.fire(
              "Cancelled!",
              "The booking has been cancelled.",
              "success",
            );
          }
        } catch (error) {
          console.error("Error canceling booking:", error);
          Swal.fire("Error", "Failed to cancel the booking.", "error");
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
          Swal.fire("Error", "Failed to delete the booking.", "error");
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
      <div className="min-h-screen flex items-center justify-center flex-col gap-2">
        <p>LOADING</p>
        <div className="loading loading-spinner text-warning"></div>
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
                    src={
                      cars[booking.carId]?.images?.[0]?.url ||
                      "https://placehold.co/400"
                    }
                    alt={cars[booking.carId]?.model}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                </td>
                <td className="px-6 py-4">
                  {cars[booking.carId]?.model || "Loading..."}
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

                <td className="px-6 py-4 flex space-x-4">
                  {booking.status === "Confirmed" ? (
                    <button
                      onClick={() => handleReview(booking)}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-400 flex items-center justify-center gap-1"
                    >
                      <FaStar /> Review
                    </button>
                  ) : booking.status === "Canceled" ? (
                    <button
                      onClick={() => handleDelete(booking._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-400 flex items-center justify-center gap-1"
                    >
                      <FaTrash /> Delete
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
        />
      )}

      {isReviewModalOpen && selectedBooking && (
        <ReviewModal
          bookingId={selectedBooking}
          closeModal={closeReviewModal}
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
