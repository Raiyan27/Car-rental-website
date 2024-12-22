import { useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";

const BookingModal = ({ car, closeModal }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [error, setError] = useState("");

  const calculateTotalPrice = () => {
    if (startDate && endDate) {
      const timeDifference = endDate.getTime() - startDate.getTime();
      const days = Math.ceil(timeDifference / (1000 * 3600 * 24));
      return days * car.price;
    }
    return 0;
  };

  const handleSubmit = () => {
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
      title: "Confirm Booking",
      text: `Are you sure you want to book ${
        car.model
      } from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()} for $${totalPrice}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10B981",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Confirm Booking",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Booking Confirmed!",
          text: `Your booking for ${
            car.model
          } from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()} has been confirmed.`,
          icon: "success",
          confirmButtonColor: "#10B981",
        });
        closeModal();
      }
    });
  };

  const isConfirmDisabled = startDate.getTime() === endDate.getTime();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-center">Confirm Booking</h2>

        <div className="text-center mb-4">
          <p className="text-lg font-semibold">{car.model}</p>
          <p className="text-gray-600 mb-2">
            Price Per Day: <span className="font-bold">${car.price}</span>
          </p>
          <p className="text-gray-600 mb-2">
            Location: <span className="font-medium">{car.location}</span>
          </p>
          <p className="text-gray-600 mb-2">
            Availability:{" "}
            <span className="font-medium">{car.availability}</span>
          </p>
          <p className="text-gray-600 mb-2">
            Features: <span className="font-medium">{car.features}</span>
          </p>
          <p className="text-gray-600">Description: {car.description}</p>
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
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
