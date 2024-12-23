import { useState, useEffect, useContext } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../Auth/AuthContext";

const EditBookingModal = ({ bookingData, closeModal }) => {
  const [startDate, setStartDate] = useState(new Date(bookingData.startDate));
  const [endDate, setEndDate] = useState(new Date(bookingData.endDate));
  const [error, setError] = useState("");
  const [car, setCar] = useState({});
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/car/${bookingData.carId}`
        );
        setCar(response.data);
      } catch (error) {
        console.error("Error fetching car details:", error);
      }
    };

    if (bookingData.carId) {
      fetchCarDetails();
    }
  }, [bookingData]);

  const calculateTotalPrice = () => {
    if (startDate && endDate) {
      const timeDifference = endDate.getTime() - startDate.getTime();
      const days = Math.ceil(timeDifference / (1000 * 3600 * 24));
      return days * car.price;
    }
    return 0;
  };

  const handleSubmit = async () => {
    const totalPrice = calculateTotalPrice();
    const maxBookingDuration = 30;
    const timeDifference = endDate.getTime() - startDate.getTime();
    const days = Math.ceil(timeDifference / (1000 * 3600 * 24));

    if (days > maxBookingDuration) {
      setError("Booking duration cannot exceed 30 days.");
      return;
    }

    setError("");

    Swal.fire({
      title: "Confirm Booking Date Change",
      text: `Are you sure you want to change your booking date for ${
        car.model
      } from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()} for $${totalPrice}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10B981",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Change Booking Date",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.patch(
            `http://localhost:5000/update-booking/${bookingData._id}`,
            {
              startDate: startDate.toISOString(),
              endDate: endDate.toISOString(),
              totalPrice: totalPrice,
            }
          );

          Swal.fire({
            title: "Booking Edited!",
            text: `Your booking for ${
              car.model
            } from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()} has been updated.`,
            icon: "success",
            confirmButtonColor: "#10B981",
          });

          closeModal();
        } catch (error) {
          Swal.fire({
            title: "Edit Failed",
            text: error.response?.data?.message || "Something went wrong.",
            icon: "error",
            confirmButtonColor: "#d33",
          });
        }
      }
    });
  };

  const isConfirmDisabled = startDate.getTime() === endDate.getTime();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Change Booking Date
        </h2>

        <div className="text-center mb-4">
          <p className="text-lg font-semibold">{car.model}</p>
          <p className="text-gray-600 mb-2">
            Price Per Day: <span className="font-bold">${car.price}</span>
          </p>
        </div>

        <div className="mb-4">
          <div>
            <p className="text-sm font-semibold mb-2">
              Existing Booking Dates:
            </p>
            <p className="text-sm text-gray-600">
              From{" "}
              <span className="font-medium">
                {new Date(bookingData.startDate).toLocaleDateString()}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {new Date(bookingData.endDate).toLocaleDateString()}
              </span>
            </p>
          </div>
        </div>

        <div className="flex space-x-4 mb-6">
          <div className="flex-1">
            <label className="block text-gray-800 mb-2 text-sm">
              Start Date
            </label>
            <ReactDatePicker
              selected={startDate}
              onChange={(date) => {
                setStartDate(date);
                if (date > endDate) {
                  setEndDate(date);
                }
                setError("");
              }}
              minDate={new Date()}
              className="w-full p-3 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          <div className="flex-1">
            <label className="block text-gray-800 mb-2 text-sm">End Date</label>
            <ReactDatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              minDate={startDate}
              className="w-full p-3 border border-gray-300 rounded-lg text-sm"
            />
          </div>
        </div>

        {error && (
          <div className="text-red-600 mb-4 text-center text-sm">
            <p>{error}</p>
          </div>
        )}

        <div className="mb-6 text-center">
          <p className="text-lg font-semibold">
            Total Price:{" "}
            <span className="font-bold">${calculateTotalPrice()}</span>
          </p>
        </div>

        <div className="flex justify-between mt-4">
          <button
            onClick={closeModal}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isConfirmDisabled}
            className={`px-6 py-2 ${
              isConfirmDisabled ? "bg-gray-400" : "bg-green-500"
            } text-white rounded-lg text-sm hover:bg-green-600`}
          >
            Confirm Date Change
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBookingModal;
