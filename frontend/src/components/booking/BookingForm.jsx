import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import SeatSelector from "./SeatSelector"; // Make sure this path is correct

const BookingForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get selectedBus safely using optional chaining
  const selectedBus = location.state?.bus;

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengerInfo, setPassengerInfo] = useState({}); // { seatNumber: { name, age } }
  const [bookedSeats, setBookedSeats] = useState([]);

  // Redirect if no selectedBus (user refreshed or came directly)
  useEffect(() => {
    if (!selectedBus) {
      alert("No bus selected. Please choose a bus first.");
      navigate("/routes"); // redirect to bus list page
    } else {
      // Initialize bookedSeats from bus data if needed
      setBookedSeats(selectedBus.bookedSeats || []);
    }
  }, [selectedBus, navigate]);

  const handleSelectSeat = (seatNumber) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seatNumber)) {
        return prev.filter((seat) => seat !== seatNumber);
      } else {
        return [...prev, seatNumber];
      }
    });
  };

  const handlePassengerInfoChange = (seatNumber, info) => {
    setPassengerInfo((prev) => ({
      ...prev,
      [seatNumber]: info,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Guard: make sure selectedBus exists
    if (!selectedBus?._id) {
      alert("Bus information missing. Please select a bus again.");
      navigate("/buses");
      return;
    }

    if (selectedSeats.length === 0) {
      alert("Please select at least one seat to book.");
      return;
    }

    // Prepare booking data
    const bookingData = {
      bus: selectedBus?._id,
      seats: selectedSeats,
      passengerInfo: selectedSeats.map((seat) => ({
        seatNumber: seat,
        ...passengerInfo[seat],
      })),
      totalPrice: selectedSeats.length * selectedBus.price,
    };

    try {
      const response = await axios.post("/api/bookings", bookingData);
      alert("Booking successful!");
      navigate("/my-bookings"); // redirect to bookings page
    } catch (error) {
      console.error("Booking error:", error);
      alert("Booking failed. Please try again.");
    }
  };

  if (!selectedBus) {
    return null; // or a loader
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">
          {selectedBus?.route?.from} → {selectedBus?.route?.to}
        </h3>
        <p className="text-gray-600 mb-2">
          Total Seats: {selectedBus.totalSeats}, Available:{" "}
          {selectedBus.totalSeats - bookedSeats.length}
        </p>
        <p className="font-semibold text-primary-600">
          Price per seat: NPR {selectedBus.price}
        </p>
      </div>

      <SeatSelector
        totalSeats={selectedBus.totalSeats}
        bookedSeats={bookedSeats}
        selectedSeats={selectedSeats}
        onSelectSeat={handleSelectSeat}
        onPassengerInfoChange={handlePassengerInfoChange}
      />

      <button
        type="submit"
        className="mt-4 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
      >
        Book Now
      </button>
    </form>
  );
};

export default BookingForm;
