import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import VehicleForm from "../components/Vehicles/VehicleForm";
import { createVehicle } from "../api/vehicles.api";

const getVehicleCreateErrorMessage = (error) => {
  const backendError = error?.response?.data;

  if (!backendError) {
    return "Error creating vehicle";
  }

  if (typeof backendError === "string") {
    return backendError;
  }

  const licensePlateMessage = backendError?.license_plate?.message;
  if (licensePlateMessage) {
    return licensePlateMessage;
  }

  const vinNumberMessage = backendError?.vin_number?.message;
  if (vinNumberMessage) {
    return vinNumberMessage;
  }

  if (typeof backendError?.error === "string") {
    return backendError.error;
  }

  if (typeof backendError?.detail === "string") {
    return backendError.detail;
  }

  return error?.message || "Error creating vehicle";
};

const CreateVehiclePage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      await createVehicle(data);
      toast.success("Vehicle created successfully");
      navigate("/vehicles");
    } catch (error) {
      console.error("Error creating vehicle:", error);
      toast.error(getVehicleCreateErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link
          to="/vehicles"
          className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to vehicles
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">New Vehicle</h1>

      <VehicleForm onSubmit={handleSubmit} isLoading={isSubmitting} />
    </div>
  );
};

export default CreateVehiclePage;
