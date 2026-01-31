import { useMemo } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import PropTypes from "prop-types";

ChartJS.register(ArcElement, Tooltip, Legend);

const DataVisualizationModal = ({ closeModal, bookings, cars }) => {
  const chartData = useMemo(() => {
    const carData = {};

    bookings.forEach((booking) => {
      const { carId, totalPrice } = booking;
      const carModel = cars[carId]?.model || "Unknown Model";
      carData[carModel] = (carData[carModel] || 0) + totalPrice;
    });

    const labels = Object.keys(carData);
    const data = Object.values(carData);

    return {
      labels,
      datasets: [
        {
          label: "Total Booking Cost",
          data,
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
          ],
          hoverBackgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
          ],
        },
      ],
    };
  }, [bookings, cars]);

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.raw || 0;
            const total = context.dataset.data.reduce(
              (sum, val) => sum + val,
              0,
            );
            const percentage = ((value / total) * 100).toFixed(2);
            return `${label}: $${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-4xl mx-4">
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-center">
          Data Visualization
        </h2>
        <p className="text-center">
          A pie chart representing the contribution of the total cost by
          different cars you booked
        </p>
        <div className="flex justify-center items-center mb-6">
          <div className="w-full max-w-md md:max-w-lg">
            <Pie data={chartData} options={options} />
          </div>
        </div>
        <div className="text-center">
          <button
            onClick={closeModal}
            className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-400 transition-all duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

DataVisualizationModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  bookings: PropTypes.arrayOf(PropTypes.object).isRequired,
  cars: PropTypes.object.isRequired,
};

export default DataVisualizationModal;
