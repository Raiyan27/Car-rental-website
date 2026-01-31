import { useState, useEffect, useContext } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../../utils/api";
import Swal from "sweetalert2";
import { AuthContext } from "../Auth/AuthContext";

const BookingModal = ({ car, closeModal }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [error, setError] = useState("");
  const [existingBookings, setExistingBookings] = useState([]);
  const [isBooking, setIsBooking] = useState(false);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchExistingBookings = async () => {
      try {
        const response = await api.get(`/bookings/car/${car._id}/public`);
        setExistingBookings(response.data.data || []);
      } catch (error) {
        console.error("Error fetching existing bookings", error);
        setExistingBookings([]);
      }
    };

    fetchExistingBookings();
  }, [car]);

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
    const email = currentUser?.email;
    const maxBookingDuration = 30;
    const timeDifference = endDate.getTime() - startDate.getTime();
    const days = Math.ceil(timeDifference / (1000 * 3600 * 24));

    if (days > maxBookingDuration) {
      setError("Booking duration cannot exceed 30 days.");
      return;
    }
    console.log(car);
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsBooking(true);
        try {
          const response = await api.post("/bookings", {
            carId: car._id,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            totalPrice,
            email,
          });

          if (response.data.success) {
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
        } catch (error) {
          console.error("Booking error:", error);
          let errorMessage = "Something went wrong. Please try again.";

          if (error.response) {
            const { status, data } = error.response;

            if (status === 401) {
              errorMessage = "You need to be logged in to make a booking.";
            } else if (status === 404) {
              errorMessage = data.error || "Car not found.";
            } else if (status === 409) {
              errorMessage =
                data.error || "Car is not available for the selected dates.";
            } else if (status === 400) {
              errorMessage =
                data.error ||
                "Invalid booking details. Please check your dates.";
            } else if (data.error) {
              errorMessage = data.error;
            }
          } else if (error.message) {
            errorMessage = error.message;
          }

          Swal.fire({
            title: "Booking Failed",
            text: errorMessage,
            icon: "error",
            confirmButtonColor: "#d33",
          });
        } finally {
          setIsBooking(false);
        }
      }
    });
  };

  const isConfirmDisabled = startDate.getTime() === endDate.getTime();

  const isDateBooked = (date) => {
    // Only confirmed bookings should block dates
    const confirmedBookings = existingBookings.filter(
      (booking) => booking.status === "Confirmed",
    );

    // Create a date at the start of the selected day in local timezone
    const checkDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );

    return confirmedBookings.some((booking) => {
      // Parse booking dates (they come from server as ISO strings)
      const bookedStartDate = new Date(booking.startDate);
      const bookedEndDate = new Date(booking.endDate);

      // Create dates at the start of the booking days
      const startDay = new Date(
        bookedStartDate.getFullYear(),
        bookedStartDate.getMonth(),
        bookedStartDate.getDate(),
      );
      const endDay = new Date(
        bookedEndDate.getFullYear(),
        bookedEndDate.getMonth(),
        bookedEndDate.getDate(),
      );

      // Check if the selected date falls within the booking range
      return checkDate >= startDay && checkDate <= endDay;
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white max-h-[600px] p-6 mx-4 my-4 rounded-lg max-w-lg w-full shadow-xl overflow-y-auto">
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

        <div className="mb-4">
          {existingBookings.length > 0 ? (
            <div>
              <h3 className="text-sm font-semibold mb-2">Existing Bookings:</h3>
              {existingBookings.map((booking, index) => (
                <p key={index} className="text-sm text-gray-600">
                  The car is{" "}
                  <span
                    className={`font-medium ${booking.status === "Confirmed" ? "text-red-600" : "text-yellow-600"}`}
                  >
                    {booking.status.toLowerCase()}
                  </span>{" "}
                  from{" "}
                  <span className="font-medium">
                    {new Date(booking.startDate).toLocaleDateString()}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {new Date(booking.endDate).toLocaleDateString()}
                  </span>
                  {booking.status === "Confirmed"
                    ? " (dates blocked)"
                    : " (may become available)"}
                  .
                </p>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600">No existing bookings.</p>
          )}
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
              filterDate={(date) => !isDateBooked(date)}
            />
          </div>

          <div className="flex-1">
            <label className="block text-gray-800 mb-2 text-sm">End Date</label>
            <ReactDatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              minDate={startDate}
              className="w-full p-3 border border-gray-300 rounded-lg text-sm"
              filterDate={(date) => !isDateBooked(date)}
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
            disabled={isConfirmDisabled || isBooking}
            className={`px-6 py-2 ${
              isConfirmDisabled || isBooking
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            } text-white rounded-lg text-sm `}
          >
            {isBooking ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Booking...
              </>
            ) : (
              "Confirm Booking"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
