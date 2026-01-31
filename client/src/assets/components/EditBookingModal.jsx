import { useState, useEffect, useContext } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import { AuthContext } from "../Auth/AuthContext";
import PropTypes from "prop-types";
import api from "../../utils/api";

const EditBookingModal = ({ bookingData, closeModal, onBookingUpdated }) => {
  const [startDate, setStartDate] = useState(new Date(bookingData.startDate));
  const [endDate, setEndDate] = useState(new Date(bookingData.endDate));
  const [error, setError] = useState("");
  const [car, setCar] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await api.get(`/cars/${bookingData.carId}`);
        if (response.data.success) {
          setCar(response.data.data);
        }
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
        setIsUpdating(true);
        try {
          const response = await api.patch(`/bookings/${bookingData._id}`, {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            totalPrice: totalPrice,
          });

          if (response.data.success) {
            Swal.fire({
              title: "Booking Edited!",
              text: `Your booking for ${
                car.model
              } from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()} has been updated.`,
              icon: "success",
              confirmButtonColor: "#10B981",
            });

            // Notify parent component of the update
            if (onBookingUpdated) {
              onBookingUpdated(bookingData._id, {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                totalPrice: totalPrice,
              });
            }

            closeModal();
          } else {
            Swal.fire({
              title: "Edit Failed",
              text: response.data.error || "Something went wrong.",
              icon: "error",
              confirmButtonColor: "#d33",
            });
          }
        } catch (error) {
          console.error("Booking edit error:", error);
          let errorMessage = "Something went wrong.";

          if (error.response) {
            const { status, data } = error.response;

            if (status === 401) {
              errorMessage = "You need to be logged in to edit bookings.";
            } else if (status === 403) {
              errorMessage = "You don't have permission to edit this booking.";
            } else if (status === 404) {
              errorMessage = "Booking not found.";
            } else if (status === 409) {
              errorMessage = "Booking conflict with existing reservations.";
            } else if (status === 400) {
              errorMessage = data.error || "Invalid booking details.";
            } else if (data.error) {
              errorMessage = data.error;
            }
          } else if (error.message) {
            errorMessage = error.message;
          }

          Swal.fire({
            title: "Edit Failed",
            text: errorMessage,
            icon: "error",
            confirmButtonColor: "#d33",
          });
        } finally {
          setIsUpdating(false);
        }
      }
    });
  };

  const isConfirmDisabled = startDate.getTime() === endDate.getTime();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full shadow-xl mx-4 my-4">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Change Booking Date
        </h2>

        <div className="text-center mb-4">
          <p className="text-lg font-semibold">{car.model}</p>
          <p className="text-lg font-semibold">
            Price Per Day:{" "}
            <span className="font-bold">
              {car.price ? `$${car.price}` : "Loading..."}
            </span>
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
            <span className="font-bold">
              {isNaN(calculateTotalPrice())
                ? "Calculating Price"
                : `$${calculateTotalPrice()}`}
            </span>
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
            disabled={isConfirmDisabled || isUpdating}
            className={`px-6 py-2 ${
              isConfirmDisabled || isUpdating
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            } text-white rounded-lg text-sm `}
          >
            {isUpdating ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Updating...
              </>
            ) : (
              "Confirm Date Change"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

EditBookingModal.propTypes = {
  bookingData: PropTypes.isRequired,
  closeModal: PropTypes.isRequired,
  onBookingUpdated: PropTypes.func,
};

export default EditBookingModal;
