import PropTypes from "prop-types";
import axios from "axios";
import Swal from "sweetalert2";

const BookingInfoModal = ({ isOpen, bookings, cars, onClose }) => {
  if (!isOpen) return null;

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  const handleAction = async (bookingId, action) => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/booking-confirmation/${bookingId}`,
        { action }
      );

      Swal.fire(
        "Success",
        action === "confirm"
          ? "Booking has been confirmed."
          : "Booking has been canceled.",
        "success"
      );
      onClose();
    } catch (error) {
      console.error("Error updating booking status:", error);
      Swal.fire("Error", "Failed to update booking status.", "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-11/12 md:w-2/3 lg:w-1/2 rounded-lg p-6 shadow-lg relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-2xl font-semibold mb-4">Booking Information</h2>
        {bookings.length === 0 ? (
          <p className="text-gray-700">No bookings available for this car.</p>
        ) : (
          <ul className="divide-y divide-gray-300">
            {bookings.map((booking) => {
              const car = cars.find((car) => car._id === booking.carId);
              const rentalDays = Math.ceil(
                (new Date(booking.endDate) - new Date(booking.startDate)) /
                  (1000 * 3600 * 24)
              );
              const bookingPrice = car ? rentalDays * car.price : 0;

              return (
                <li key={booking._id} className="py-4">
                  <p className="text-gray-700">
                    <strong>Client Email:</strong> {booking.clientEmail}
                  </p>
                  <p className="text-gray-700">
                    <strong>Start Date:</strong> {formatDate(booking.startDate)}
                  </p>
                  <p className="text-gray-700">
                    <strong>End Date:</strong> {formatDate(booking.endDate)}
                  </p>
                  <p className="text-gray-700">
                    <strong>Status:</strong>{" "}
                    <span
                      className={
                        booking.status === "Confirmed"
                          ? "text-green-500 font-semibold"
                          : booking.status === "Canceled"
                          ? "text-red-500 font-semibold"
                          : "text-yellow-500 font-semibold"
                      }
                    >
                      {booking.status}
                    </span>
                  </p>
                  <p className="text-gray-700">
                    <strong>Booking Price:</strong> ${bookingPrice}
                  </p>
                  {booking.status === "Pending" && (
                    <div className="flex space-x-4 mt-3">
                      <button
                        onClick={() => handleAction(booking._id, "confirm")}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => handleAction(booking._id, "cancel")}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-400"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
        <button
          onClick={onClose}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg mt-6 hover:bg-gray-400 w-full"
        >
          Close
        </button>
      </div>
    </div>
  );
};

BookingInfoModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  bookings: PropTypes.array.isRequired,
  cars: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default BookingInfoModal;
