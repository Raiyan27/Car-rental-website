import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";

const EditModal = ({ carData, isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState(carData || {});
  const [images, setImages] = useState([]);

  const onDrop = (acceptedFiles) => {
    setImages(acceptedFiles);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    images.forEach((image) => data.append("images", image));

    onSubmit(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-4 p-6">
        <h2 className="text-2xl font-bold mb-4 text-bluePrimary">Edit Car</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="model"
              className="block text-bluePrimary font-medium"
            >
              Car Model
            </label>
            <input
              type="text"
              id="model"
              name="model"
              defaultValue={carData.model}
              onChange={handleChange}
              placeholder="E.g. Toyota, Corolla"
              required
              className="w-full p-2 border border-bluePrimary rounded focus:outline-none focus:ring focus:ring-blueSecondary"
            />
          </div>

          <div>
            <label
              htmlFor="price"
              className="block text-bluePrimary font-medium"
            >
              Daily Rental Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              defaultValue={carData.price}
              onChange={handleChange}
              placeholder="E.g. 50."
              required
              className="w-full p-2 border border-bluePrimary rounded focus:outline-none focus:ring focus:ring-blueSecondary"
            />
          </div>

          <div>
            <label
              htmlFor="availability"
              className="block text-bluePrimary font-medium"
            >
              Availability
            </label>
            <select
              id="availability"
              name="availability"
              defaultValue={carData.availability}
              onChange={handleChange}
              className="w-full p-2 border border-bluePrimary rounded focus:outline-none focus:ring focus:ring-blueSecondary"
            >
              <option value="Available">Available</option>
              <option value="Unavailable">Unavailable</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="registration"
              className="block text-bluePrimary font-medium"
            >
              Vehicle Registration Number
            </label>
            <input
              type="text"
              id="registration"
              name="registration"
              defaultValue={carData.registration}
              onChange={handleChange}
              placeholder="E.g. T 123 ABC"
              required
              className="w-full p-2 border border-bluePrimary rounded focus:outline-none focus:ring focus:ring-blueSecondary"
            />
          </div>

          <div>
            <label
              htmlFor="features"
              className="block text-bluePrimary font-medium"
            >
              Features
            </label>
            <input
              type="text"
              id="features"
              name="features"
              defaultValue={carData.features}
              onChange={handleChange}
              placeholder="E.g., GPS, AC, etc."
              className="w-full p-2 border border-bluePrimary rounded focus:outline-none focus:ring focus:ring-blueSecondary"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-bluePrimary font-medium"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              defaultValue={carData.description}
              onChange={handleChange}
              required
              className="w-full p-2 border border-bluePrimary rounded focus:outline-none focus:ring focus:ring-blueSecondary"
            />
          </div>

          <div>
            <label
              htmlFor="location"
              className="block text-bluePrimary font-medium"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              defaultValue={carData.location}
              onChange={handleChange}
              placeholder="E.g. Dhaka, Bangladesh"
              required
              className="w-full p-2 border border-bluePrimary rounded focus:outline-none focus:ring focus:ring-blueSecondary"
            />
          </div>

          <div>
            <label className="block text-bluePrimary font-medium">Images</label>
            <div
              {...getRootProps({
                className:
                  "w-full p-4 border-2 border-dashed border-bluePrimary rounded bg-[#FADA7A] text-center cursor-pointer",
              })}
            >
              <input {...getInputProps()} />
              <p>Drag & drop images here, or click to select files</p>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-bluePrimary text-accent font-bold py-2 px-4 rounded hover:bg-blueSecondary"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
