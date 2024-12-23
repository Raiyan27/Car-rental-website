import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaSort } from "react-icons/fa";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import axios from "axios";
import EditModal from "./EditModal";
import { AuthContext } from "../Auth/AuthContext";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [sortOption, setSortOption] = useState("dateAdded");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [priceSortOrder, setPriceSortOrder] = useState("lowToHigh");
  const [cars, setCars] = useState({});
  const { currentUser } = useContext(AuthContext);
  const email = currentUser?.email;

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get("http://localhost:5000/my-bookings", {
          params: { email },
        });

        setBookings(response.data);
        const carIds = response.data.map((booking) => booking.carId);
        fetchCarDetails(carIds);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    if (email) fetchBookings();
  }, [email]);

  const fetchCarDetails = async (carIds) => {
    try {
      const carDataPromises = carIds.map((carId) =>
        axios.get(`http://localhost:5000/car/${carId}`)
      );
      const carDataResponses = await Promise.all(carDataPromises);
      const carDetails = {};
      carDataResponses.forEach((response) => {
        if (response.data && response.data._id) {
          carDetails[response.data._id] = response.data;
        }
      });

      setCars(carDetails);
    } catch (error) {
      console.error("Error fetching car details:", error);
    }
  };

  const handleSort = (option) => {
    const sortedBookings = [...bookings].sort((a, b) => {
      if (option === "priceLow" || option === "priceHigh") {
        return priceSortOrder === "lowToHigh"
          ? a.price - b.price
          : b.price - a.price;
      }
      if (option === "dateAdded") {
        return new Date(b.date) - new Date(a.date);
      }
      if (option === "dateAddedOld") {
        return new Date(a.date) - new Date(b.date);
      }
      return 0;
    });
    setSortOption(option);
    setBookings(sortedBookings);
  };

  const togglePriceSort = () => {
    const newSortOrder =
      priceSortOrder === "lowToHigh" ? "highToLow" : "lowToHigh";
    setPriceSortOrder(newSortOrder);
    handleSort(newSortOrder === "lowToHigh" ? "priceLow" : "priceHigh");
  };

  const handleEdit = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5000/cancel-booking/${id}`);
          setBookings(bookings.filter((booking) => booking.id !== id));
          Swal.fire("Deleted!", "The booking has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting booking:", error);
          Swal.fire("Error", "Failed to delete the booking.", "error");
        }
      }
    });
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  if (bookings.length === 0) {
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

  return (
    <div className="container mx-auto py-16 min-h-screen">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <div className="flex flex-col sm:flex-row gap-2 space-x-4 items-center justify-center">
          <span>Sort By:</span>
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 flex justify-center items-center"
            onClick={() => handleSort("dateAdded")}
          >
            <FaSort /> Date Added
          </button>
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 flex justify-center items-center"
            onClick={togglePriceSort}
          >
            <FaSort />
            {priceSortOrder === "lowToHigh"
              ? "Price (Low to High)"
              : "Price (High to Low)"}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow shadow">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="px-6 py-3">Booking ID</th>
              <th className="px-6 py-3">Car Image</th>
              <th className="px-6 py-3">Car Model</th>
              <th className="px-6 py-3">Booking Dates</th>
              <th className="px-6 py-3">Total Price</th>
              <th className="px-6 py-3 hidden md:table-cell">Booking Date</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-100">
                <td className="px-6 py-4">{booking.id}</td>
                <td className="px-6 py-4">
                  <img
                    src={cars[booking.carId]?.image || "/placeholder.jpg"}
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
                <td className="px-6 py-4 hidden md:table-cell">
                  {formatDate(booking.createdAt)}
                </td>
                <td className="px-6 py-4 flex space-x-4">
                  <button
                    onClick={() => handleEdit(booking)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-400 flex items-center justify-center gap-1"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(booking.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-400 flex items-center justify-center gap-1"
                  >
                    <FaTrash /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <EditModal
        bookingData={selectedBooking}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </div>
  );
};

export default MyBookings;
