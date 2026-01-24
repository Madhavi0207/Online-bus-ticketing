import React from "react";
import { UserCheck } from "lucide-react";

const SeatSelector = ({
  totalSeats = 40,
  bookedSeats = [],
  selectedSeats = [],
  onSelectSeat,
}) => {
  const seatsPerRow = 4;
  const totalRows = Math.ceil(totalSeats / seatsPerRow);

  const handleSeatClick = (seatNumber) => {
    if (bookedSeats.includes(seatNumber)) return; // cannot select booked seats
    onSelectSeat(seatNumber);
  };

  const renderSeat = (seatNumber) => {
    const isBooked = bookedSeats.includes(seatNumber);
    const isSelected = selectedSeats.includes(seatNumber);

    let seatClass =
      "w-12 h-12 rounded-lg flex items-center justify-center font-semibold cursor-pointer transition-all duration-200 ";

    if (isBooked) {
      seatClass += "bg-red-100 text-red-400 cursor-not-allowed"; // Booked
    } else if (isSelected) {
      seatClass +=
        "bg-blue-600 text-white ring-2 ring-blue-300 transform scale-105"; // Selected
    } else {
      seatClass +=
        "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"; // Available
    }

    return (
      <button
        key={seatNumber}
        onClick={() => handleSeatClick(seatNumber)}
        disabled={isBooked}
        className={seatClass}
      >
        {isSelected ? <UserCheck className="h-5 w-5 text-white" /> : seatNumber}
      </button>
    );
  };

  const renderSeatLayout = () => {
    const seatRows = [];
    for (let row = 0; row < totalRows; row++) {
      const rowSeats = [];
      for (let col = 0; col < seatsPerRow; col++) {
        const seatNumber = row * seatsPerRow + col + 1;
        if (seatNumber <= totalSeats) {
          rowSeats.push(renderSeat(seatNumber));
        }
      }
      seatRows.push(
        <div key={row} className="flex justify-center space-x-4 mb-4">
          {rowSeats}
        </div>,
      );
    }
    return seatRows;
  };

  return (
    <div className="space-y-6">
      {/* Seat Legend */}
      <div className="flex justify-center gap-8 mb-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded bg-gray-100 border border-gray-300"></span>
          <span className="text-gray-600">Available</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded bg-blue-600 ring-2 ring-blue-300 flex items-center justify-center text-white">
            <UserCheck className="h-3 w-3" />
          </span>
          <span className="text-gray-600">Selected</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded bg-red-100 border border-red-300"></span>
          <span className="text-gray-600">Booked</span>
        </div>
      </div>

      {/* Seat Layout */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="text-center mb-8">
          <div className="w-32 h-8 bg-gray-800 rounded-lg mx-auto mb-2"></div>
          <p className="text-sm text-gray-500">Driver's Cabin</p>
        </div>

        {renderSeatLayout()}
      </div>
    </div>
  );
};

export default SeatSelector;
