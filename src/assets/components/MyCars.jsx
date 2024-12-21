import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaSort } from "react-icons/fa";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { useDropzone } from "react-dropzone";
import EditModal from "./EditModal";

const MyCars = () => {
  const [cars, setCars] = useState([]);
  const [sortOption, setSortOption] = useState("dateAdded");
  const [selectedCar, setSelectedCar] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSort = (option) => {
    const sortedCars = [...cars].sort((a, b) => {
      if (option === "priceLow") return a.price - b.price;
      if (option === "priceHigh") return b.price - a.price;
      if (option === "dateAdded")
        return new Date(b.dateAdded) - new Date(a.dateAdded);
      if (option === "dateAddedOld")
        return new Date(a.dateAdded) - new Date(b.dateAdded);
      return 0;
    });
    setSortOption(option);
    setCars(sortedCars);
  };

  const handleEdit = (car) => {
    setSelectedCar(car);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        setCars(cars.filter((car) => car.id !== id));
        Swal.fire("Deleted!", "The car has been deleted.", "success");
      }
    });
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalSubmit = (updatedData) => {
    const updatedCars = cars.map((car) =>
      car.id === selectedCar.id ? { ...car, ...updatedData } : car
    );
    setCars(updatedCars);
    setIsModalOpen(false);
    Swal.fire("Success!", "Car details updated successfully.", "success");
  };

  if (cars.length === 0) {
    return (
      <div className="text-center py-16">
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

  return (
    <div className="container mx-auto py-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Cars</h1>
        <div className="flex space-x-4 items-center">
          <span>Sort By:</span>
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => handleSort("dateAdded")}
          >
            <FaSort /> Date Added
          </button>
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => handleSort("priceLow")}
          >
            <FaSort /> Price (Low to High)
          </button>
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => handleSort("priceHigh")}
          >
            <FaSort /> Price (High to Low)
          </button>
        </div>
      </div>

      <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="px-6 py-3">Car Image</th>
            <th className="px-6 py-3">Car Model</th>
            <th className="px-6 py-3">Daily Rental Price</th>
            <th className="px-6 py-3">Availability</th>
            <th className="px-6 py-3">Date Added</th>
            <th className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {cars.map((car) => (
            <tr key={car.id} className="hover:bg-gray-100">
              <td className="px-6 py-4">
                <img
                  src={car.image}
                  alt={car.model}
                  className="w-16 h-16 object-cover rounded"
                />
              </td>
              <td className="px-6 py-4">{car.model}</td>
              <td className="px-6 py-4">${car.price}/day</td>
              <td className="px-6 py-4">{car.availability}</td>
              <td className="px-6 py-4">{car.dateAdded}</td>
              <td className="px-6 py-4 flex space-x-4">
                <button
                  onClick={() => handleEdit(car)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-400"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => handleDelete(car.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-400"
                >
                  <FaTrash /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <EditModal
        carData={selectedCar}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
};

export default MyCars;
