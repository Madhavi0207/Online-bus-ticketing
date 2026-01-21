import React from "react";
import SeatSelector from "./SeatSelector";

const BookingForm = ({
  bus,
  selectedSeats,
  passengerInfo,
  travelDate,
  totalAmount,
  onConfirm,
}) => {
  if (!bus) return null;

  // Get booked seats from bus
  const bookedSeats =
    bus.seats?.filter((s) => s.isBooked).map((s) => s.seatNumber) || [];

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">
          {bus?.route?.from} → {bus?.route?.to}
        </h3>
        <p className="text-gray-600 mb-2">
          Total Seats: {bus.totalSeats}, Available:{" "}
          {bus.totalSeats - bookedSeats.length}
        </p>
        <p className="font-semibold text-primary-600">
          Price per seat: NPR {bus.price}
        </p>
      </div>

      <SeatSelector
        totalSeats={bus.totalSeats}
        bookedSeats={bookedSeats}
        selectedSeats={selectedSeats}
        onSelectSeat={(seat) => {
          // optional: if you want BookingForm to handle seat change, otherwise handled in BookingPage
        }}
        onPassengerInfoChange={(seatNumber, info) => {
          // optional: if you want BookingForm to handle passenger info, otherwise handled in BookingPage
        }}
      />

      <div className="border-t pt-3 flex justify-between font-bold text-lg mt-4">
        <span>Total Amount:</span>
        <span className="text-primary-600">NPR {totalAmount}</span>
      </div>

      <button
        type="button"
        onClick={onConfirm}
        className="mt-4 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
      >
        Confirm Booking
      </button>
    </div>
  );
};

export default BookingForm;
