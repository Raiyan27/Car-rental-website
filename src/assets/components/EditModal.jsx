import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import axios from "axios";

const EditModal = ({ carData, isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    model: "",
    price: "",
    availability: "Available",
    registration: "",
    features: "",
    description: "",
    location: "",
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    if (isOpen && carData) {
      setFormData({
        model: carData.model,
        price: carData.price,
        availability: carData.availability,
        registration: carData.registration,
        features: carData.features,
        description: carData.description,
        location: carData.location,
      });
      setImages(carData.images || []);
      setImagePreviews(
        carData.images ? carData.images.map((img) => ({ preview: img })) : []
      );
    }
  }, [isOpen, carData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const onDrop = (acceptedFiles) => {
    const maxSize = 150 * 1024;
    const validFiles = [];
    const filePreviews = [];

    acceptedFiles.forEach((file) => {
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large. Max image size is 150KB`);
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        validFiles.push(reader.result);
        filePreviews.push({
          name: file.name,
          preview: URL.createObjectURL(file),
        });

        if (validFiles.length === acceptedFiles.length) {
          setImages((prevImages) => [...prevImages, ...validFiles]);
          setImagePreviews((prevPreviews) => [
            ...prevPreviews,
            ...filePreviews,
          ]);
        }
      };
      reader.onerror = (error) => {
        console.error("Error converting files to Base64:", error);
      };
    });
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.error("Please upload at least one image.");
      return;
    }

    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      images,
    };

    try {
      const response = await axios.patch(
        `http://localhost:5000/update-car/${carData._id}`,
        payload,
        { withCredentials: true },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Car updated successfully!");

        onClose(response.data);
      }
    } catch (error) {
      console.error("Error updating the car:", error);
      toast.error("Error updating car.");
    }
  };

  const handleRemoveImage = (index) => {
    const newImages = [...images];
    const newPreviews = [...imagePreviews];
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      style={{ overflow: "hidden" }}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-4 p-6 overflow-auto max-h-screen"
        style={{ maxHeight: "90vh", overflowY: "auto" }}
      >
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
              value={formData.model}
              onChange={handleChange}
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
              value={formData.price}
              onChange={handleChange}
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
              value={formData.availability}
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
              value={formData.registration}
              onChange={handleChange}
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
              value={formData.features}
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
              value={formData.description}
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
              value={formData.location}
              onChange={handleChange}
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

          <div className="mt-4">
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {imagePreviews.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={file.preview}
                      alt={`Preview ${file.name}`}
                      className="w-full h-32 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full p-1"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            )}
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
