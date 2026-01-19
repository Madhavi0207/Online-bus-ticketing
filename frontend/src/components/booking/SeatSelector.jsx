import React, { useState } from "react";
import { User, UserCheck, X } from "lucide-react";

const SeatSelector = ({
  totalSeats = 40,
  bookedSeats = [],
  selectedSeats,
  onSelectSeat,
  onPassengerInfoChange,
}) => {
  const [passengerInfo, setPassengerInfo] = useState({});

  const seatsPerRow = 4;
  const totalRows = Math.ceil(totalSeats / seatsPerRow);

  const handleSeatClick = (seatNumber) => {
    if (bookedSeats.includes(seatNumber)) return;
    onSelectSeat(seatNumber);

    // Initialize passenger info for new seat
    if (!selectedSeats.includes(seatNumber)) {
      setPassengerInfo((prev) => ({
        ...prev,
        [seatNumber]: { name: "", age: "" },
      }));
    }
  };

  const handlePassengerInfoChange = (seatNumber, field, value) => {
    const updatedInfo = {
      ...passengerInfo,
      [seatNumber]: {
        ...passengerInfo[seatNumber],
        [field]: value,
      },
    };
    setPassengerInfo(updatedInfo);
    onPassengerInfoChange(seatNumber, field, value);
  };

  const renderSeat = (seatNumber) => {
    const isBooked = bookedSeats.includes(seatNumber);
    const isSelected = selectedSeats.includes(seatNumber);

    let seatClass =
      "w-12 h-12 rounded-lg flex items-center justify-center font-semibold cursor-pointer transition-all duration-200 ";

    if (isBooked) {
      seatClass += "bg-red-100 text-red-400 cursor-not-allowed";
    } else if (isSelected) {
      seatClass += "bg-primary-600 text-white transform scale-105";
    } else {
      seatClass +=
        "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105";
    }

    return (
      <button
        key={seatNumber}
        onClick={() => handleSeatClick(seatNumber)}
        disabled={isBooked}
        className={seatClass}
      >
        {isSelected ? <UserCheck className="h-5 w-5" /> : seatNumber}
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
        </div>
      );
    }
    return seatRows;
  };

  return (
    <div className="space-y-6">
      {/* Seat Legend */}
      <div className="flex justify-center space-x-6 mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gray-100 rounded"></div>
          <span className="text-sm text-gray-600">Available</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-primary-600 rounded"></div>
          <span className="text-sm text-gray-600">Selected</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-red-100 rounded"></div>
          <span className="text-sm text-gray-600">Booked</span>
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

      {/* Passenger Information Form */}
      {selectedSeats.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Passenger Information</h3>
          <div className="space-y-4">
            {selectedSeats.map((seatNumber) => (
              <div key={seatNumber} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-primary-600" />
                    <span className="font-medium">Seat {seatNumber}</span>
                  </div>
                  <button
                    onClick={() => handleSeatClick(seatNumber)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Passenger Name
                    </label>
                    <input
                      type="text"
                      value={passengerInfo[seatNumber]?.name || ""}
                      onChange={(e) =>
                        handlePassengerInfoChange(
                          seatNumber,
                          "name",
                          e.target.value
                        )
                      }
                      placeholder="Full name"
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Age
                    </label>
                    <input
                      type="number"
                      value={passengerInfo[seatNumber]?.age || ""}
                      onChange={(e) =>
                        handlePassengerInfoChange(
                          seatNumber,
                          "age",
                          e.target.value
                        )
                      }
                      placeholder="Age"
                      min="1"
                      max="100"
                      className="input-field"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selection Summary */}
      <div className="bg-primary-50 rounded-xl p-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="font-semibold text-gray-900">
              {selectedSeats.length} seat{selectedSeats.length !== 1 ? "s" : ""}{" "}
              selected
            </div>
            <div className="text-sm text-gray-600">
              Seats: {selectedSeats.join(", ")}
            </div>
          </div>
          <div className="text-lg font-bold">
            Total Seats: {selectedSeats.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelector;
