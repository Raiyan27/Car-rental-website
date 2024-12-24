import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaEdit,
  FaTrash,
  FaSort,
  FaInfoCircle,
  FaSearch,
} from "react-icons/fa";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import axios from "axios";
import EditModal from "./EditModal";
import { AuthContext } from "../Auth/AuthContext";
import BookingInfoModal from "./BookingInfoModal";
import { Helmet } from "react-helmet";

const MyCars = () => {
  const [cars, setCars] = useState([]);
  const [sortOption, setSortOption] = useState("dateAdded");
  const [selectedCar, setSelectedCar] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [priceSortOrder, setPriceSortOrder] = useState("lowToHigh");
  const [bookingInfo, setBookingInfo] = useState([]);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useContext(AuthContext);
  const [dateSortOrder, setDateSortOrder] = useState("newestToOldest");
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

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
    const fetchCars = async () => {
      try {
        const response = await axios.get("http://localhost:5000/car", {
          params: { email, page: currentPage, limit: 5, searchQuery },
          withCredentials: true,
        });
        setLoading(false);
        setCars(response.data.cars);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching cars:", error);
      }
    };
    if (email) fetchCars();
  }, [email, isModalOpen, currentPage, searchQuery]);

  const handleSort = (option) => {
    const sortedCars = [...cars].sort((a, b) => {
      if (option === "priceLow" || option === "priceHigh") {
        return priceSortOrder === "lowToHigh"
          ? a.price - b.price
          : b.price - a.price;
      }
      if (option === "dateAdded") {
        return dateSortOrder === "newestToOldest"
          ? new Date(b.createdAt) - new Date(a.createdAt)
          : new Date(a.createdAt) - new Date(b.createdAt);
      }
      return 0;
    });
    setSortOption(option);
    setCars(sortedCars);
  };

  const togglePriceSort = () => {
    const newSortOrder =
      priceSortOrder === "lowToHigh" ? "highToLow" : "lowToHigh";
    setPriceSortOrder(newSortOrder);
    handleSort(newSortOrder === "lowToHigh" ? "priceLow" : "priceHigh");
  };
  const toggleDateSort = () => {
    const newSortOrder =
      dateSortOrder === "newestToOldest" ? "oldestToNewest" : "newestToOldest";
    setDateSortOrder(newSortOrder);
    handleSort("dateAdded");
  };

  const handleEdit = (car) => {
    setSelectedCar(car);
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
          await axios.delete(`http://localhost:5000/delete-car/${id}`);
          setCars((prevCars) => prevCars.filter((car) => car._id !== id));
          Swal.fire("Deleted!", "The car has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting car:", error);
          Swal.fire("Error", "Failed to delete the car.", "error");
        }
      }
    });
  };

  const handleModalClose = (updatedCar) => {
    setIsModalOpen(false);
  };

  const handleBookingInfo = async (carId) => {
    try {
      const response = await axios.get("http://localhost:5000/owner-bookings", {
        params: { carId },
        withCredentials: true,
      });
      setBookingInfo(response.data);
      setIsBookingModalOpen(true);
    } catch (error) {
      console.error("Error fetching booking info:", error);
    }
  };

  if (cars.length === 0 && !searchQuery && !loading) {
    return (
      <div className="text-center py-16 min-h-screen">
        <h2 className="text-3xl font-bold mb-4">No Cars Added Yet</h2>
        <Link
          to="/add-car"
          className="px-6 py-3 bg-yellow-500 text-gray-900 font-semibold rounded-lg hover:bg-yellow-400 transition-all duration-300"
        >
          Add Your First Car
        </Link>
      </div>
    );
  }

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
    <div className="container mx-auto py-16 min-h-screen">
      <div className="flex justify-center mb-4">
        <h1 className="text-3xl font-bold">My Cars</h1>
      </div>
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
        <div className="relative">
          <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by car model..."
            className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-yellowSecondary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2 space-x-4 items-center justify-center">
          <span>Sort By:</span>
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 flex justify-center items-center"
            onClick={toggleDateSort}
          >
            <FaSort />
            {dateSortOrder === "newestToOldest"
              ? "Date (Newest to Oldest)"
              : "Date (Oldest to Newest)"}
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
              <th className="px-6 py-3">Car Image</th>
              <th className="px-6 py-3">Car Model</th>
              <th className="px-6 py-3">Daily Rental Price</th>
              <th className="px-6 py-3 hidden md:table-cell">Availability</th>
              <th className="px-6 py-3 hidden md:table-cell">Date Added</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => (
              <tr key={car.id} className="hover:bg-gray-100">
                <td className="px-6 py-4">
                  <img
                    src={car.images[0]}
                    alt={car.model}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td className="px-6 py-4">{car.model}</td>
                <td className="px-6 py-4">${car.price}/day</td>
                <td className="px-6 py-4 hidden md:table-cell">
                  {car.availability === "Available" ? "Yes" : "No"}
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  {formatDate(car.createdAt)}
                </td>
                <td className="px-6 py-4 flex space-x-4">
                  <button
                    onClick={() => handleEdit(car)}
                    className="px-4 py-2 bg-bluePrimary text-white rounded hover:bg-blue-400 flex items-center justify-center gap-1"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(car._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-400 flex items-center justify-center gap-1"
                  >
                    <FaTrash /> Delete
                  </button>
                  <button
                    onClick={() => handleBookingInfo(car._id)}
                    className="px-4 py-2 bg-yellowSecondary text-gray-700 rounded hover:bg-yellowPrimary flex items-center justify-center gap-1"
                  >
                    <FaInfoCircle /> Booking Info
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {cars.length === 0 && searchQuery && (
          <div className="text-center py-16">
            <p className="text-2xl font-semibold text-gray-500">
              No cars match your search for "
              <span className="font-bold">{searchQuery}</span>".
            </p>
            <p className="text-gray-400">Try adjusting your search terms.</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center space-x-2 mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg ${
            currentPage === 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-bluePrimary text-white hover:bg-blue-500"
          }`}
        >
          Previous
        </button>
        {[...Array(totalPages).keys()].map((_, index) => {
          const pageNumber = index + 1;
          return (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              className={`px-3 py-2 rounded-lg ${
                currentPage === pageNumber
                  ? "bg-yellowSecondary text-gray-800 font-semibold"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {pageNumber}
            </button>
          );
        })}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-lg ${
            currentPage === totalPages
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-bluePrimary text-white hover:bg-blue-500"
          }`}
        >
          Next
        </button>
      </div>

      <EditModal
        carData={selectedCar}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />

      <BookingInfoModal
        isOpen={isBookingModalOpen}
        bookings={bookingInfo}
        cars={cars}
        onClose={() => setIsBookingModalOpen(false)}
      />
      <Helmet>
        <meta charSet="utf-8" />
        <title>Gari Chai - My Cars</title>
      </Helmet>
    </div>
  );
};

export default MyCars;
