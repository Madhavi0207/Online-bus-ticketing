import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { routesAPI, bookingsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { format, addDays } from "date-fns";
import toast from "react-hot-toast";

const Booking = () => {
  const { routeId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [route, setRoute] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [departureDate, setDepartureDate] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [passengers, setPassengers] = useState([
    { name: "", age: "", gender: "" },
  ]);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [loading, setLoading] = useState(false);
  const [seatMap, setSeatMap] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    const fetchRoute = async () => {
      try {
        const response = await routesAPI.getById(routeId);
        setRoute(response.data.route);

        // Set first departure time as default
        if (response.data.route.departureTimes?.length > 0) {
          setDepartureTime(response.data.route.departureTimes[0]);
        }

        // Generate seat map
        generateSeatMap();
      } catch (error) {
        console.error("Error fetching route:", error);
        toast.error("Failed to load route details");
      }
    };

    fetchRoute();

    // Set default departure date to tomorrow
    const tomorrow = addDays(new Date(), 1);
    setDepartureDate(format(tomorrow, "yyyy-MM-dd"));
  }, [routeId, user, navigate]);

  const generateSeatMap = () => {
    const rows = ["A", "B", "C", "D"];
    const seatLayout = [];

    rows.forEach((row) => {
      const rowSeats = [];
      for (let i = 1; i <= 10; i++) {
        const seatNumber = `${row}${i}`;
        rowSeats.push({
          number: seatNumber,
          isAvailable: true, // This would come from API in real app
          isSelected: false,
        });
      }
      seatLayout.push({
        row,
        seats: rowSeats,
      });
    });

    setSeatMap(seatLayout);
  };

  const handleSeatClick = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
    } else {
      if (selectedSeats.length < passengers.length) {
        setSelectedSeats([...selectedSeats, seatNumber]);
      } else {
        toast.error(
          `You can only select ${passengers.length} seats for ${passengers.length} passenger(s)`
        );
      }
    }
  };

  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index][field] = value;
    setPassengers(updatedPassengers);
  };

  const addPassenger = () => {
    if (passengers.length < 10) {
      // Max 10 passengers
      setPassengers([...passengers, { name: "", age: "", gender: "" }]);
    } else {
      toast.error("Maximum 10 passengers allowed per booking");
    }
  };

  const removePassenger = (index) => {
    if (passengers.length > 1) {
      const updatedPassengers = [...passengers];
      updatedPassengers.splice(index, 1);
      setPassengers(updatedPassengers);

      // Remove corresponding seat if selected
      if (selectedSeats[index]) {
        const updatedSeats = [...selectedSeats];
        updatedSeats.splice(index, 1);
        setSelectedSeats(updatedSeats);
      }
    }
  };

  const validateForm = () => {
    if (!departureDate) {
      toast.error("Please select departure date");
      return false;
    }

    if (!departureTime) {
      toast.error("Please select departure time");
      return false;
    }

    if (selectedSeats.length !== passengers.length) {
      toast.error("Please select seats for all passengers");
      return false;
    }

    for (let i = 0; i < passengers.length; i++) {
      const passenger = passengers[i];
      if (!passenger.name.trim()) {
        toast.error(`Please enter name for passenger ${i + 1}`);
        return false;
      }
      if (!passenger.age || passenger.age < 1 || passenger.age > 100) {
        toast.error(`Please enter valid age (1-100) for passenger ${i + 1}`);
        return false;
      }
      if (!passenger.gender) {
        toast.error(`Please select gender for passenger ${i + 1}`);
        return false;
      }
    }

    return true;
  };

  const handleBooking = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const bookingData = {
        routeId,
        seatNumbers: selectedSeats,
        passengers: passengers.map((passenger, index) => ({
          ...passenger,
          seatNumber: selectedSeats[index],
        })),
        departureDate,
        departureTime,
        paymentMethod,
      };

      const response = await bookingsAPI.create(bookingData);

      if (response.data.success) {
        toast.success("Booking confirmed successfully!");
        navigate("/my-bookings");
      }
    } catch (error) {
      console.error("Booking error:", error);
      const message =
        error.response?.data?.message || "Booking failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!route) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const totalAmount = route.price * passengers.length;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Book Your Journey
        </h1>
        <p className="text-gray-600">
          Complete your booking in a few simple steps
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Booking Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Route Details Card */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">Route Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Departure Date
                  </label>
                  <input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    min={format(new Date(), "yyyy-MM-dd")}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Departure Time
                  </label>
                  <select
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    className="input-field"
                  >
                    {route.departureTimes?.map((time, index) => (
                      <option key={index} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">From</p>
                    <p className="text-lg font-semibold">{route.from}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">To</p>
                    <p className="text-lg font-semibold">{route.to}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Duration</p>
                    <p className="text-lg">{route.duration}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Bus Type</p>
                    <p className="text-lg capitalize">{route.busType}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Seat Selection Card */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Select Seats</h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-100 border border-green-400 rounded mr-2"></div>
                  <span className="text-sm">Available</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-100 border border-blue-400 rounded mr-2"></div>
                  <span className="text-sm">Selected</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-100 border border-red-400 rounded mr-2"></div>
                  <span className="text-sm">Booked</span>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <p className="text-gray-700 mb-4">
                Available seats: {route.availableSeats} /{" "}
                {route.totalSeats || 40}
              </p>

              {/* Bus Layout */}
              <div className="bg-gray-50 rounded-2xl p-8">
                {/* Driver's Area */}
                <div className="flex justify-center mb-8">
                  <div className="bg-gray-200 rounded-lg px-6 py-3">
                    <span className="text-sm font-semibold text-gray-700">
                      DRIVER
                    </span>
                  </div>
                </div>

                {/* Seats */}
                <div className="space-y-6">
                  {seatMap.map((row) => (
                    <div
                      key={row.row}
                      className="flex items-center justify-center"
                    >
                      <div className="w-12 text-center font-semibold text-gray-700 mr-4">
                        Row {row.row}
                      </div>
                      <div className="flex space-x-3">
                        {row.seats.map((seat, seatIndex) => (
                          <button
                            key={`${row.row}${seatIndex + 1}`}
                            onClick={() => handleSeatClick(seat.number)}
                            disabled={!seat.isAvailable}
                            className={`
                              w-12 h-12 rounded-lg flex items-center justify-center font-semibold text-sm
                              transition-all duration-200
                              ${
                                selectedSeats.includes(seat.number)
                                  ? "bg-blue-500 text-white border-2 border-blue-600"
                                  : seat.isAvailable
                                  ? "bg-green-100 text-green-700 border-2 border-green-300 hover:bg-green-200 hover:border-green-400"
                                  : "bg-red-100 text-red-700 border-2 border-red-300 cursor-not-allowed opacity-50"
                              }
                              ${seatIndex === 4 && "ml-6"}
                            `}
                          >
                            {seat.number}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Aisle */}
                <div className="mt-8 flex justify-center">
                  <div className="w-64 h-1 bg-gray-300 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Passenger Details */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Passenger Details</h2>
                <button
                  type="button"
                  onClick={addPassenger}
                  className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add Passenger
                </button>
              </div>

              <div className="space-y-6">
                {passengers.map((passenger, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">
                        Passenger {index + 1}
                      </h3>
                      {passengers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePassenger(index)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={passenger.name}
                          onChange={(e) =>
                            handlePassengerChange(index, "name", e.target.value)
                          }
                          className="input-field"
                          placeholder="Enter full name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Age *
                        </label>
                        <input
                          type="number"
                          value={passenger.age}
                          onChange={(e) =>
                            handlePassengerChange(index, "age", e.target.value)
                          }
                          className="input-field"
                          placeholder="Age"
                          min="1"
                          max="100"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Gender *
                        </label>
                        <select
                          value={passenger.gender}
                          onChange={(e) =>
                            handlePassengerChange(
                              index,
                              "gender",
                              e.target.value
                            )
                          }
                          className="input-field"
                          required
                        >
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    {selectedSeats[index] && (
                      <div className="mt-4 flex items-center text-gray-700">
                        <svg
                          className="w-5 h-5 mr-2 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Seat assigned:{" "}
                        <span className="font-semibold ml-2">
                          {selectedSeats[index]}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24">
            <h2 className="text-2xl font-bold mb-6">Booking Summary</h2>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between">
                <span className="text-gray-600">Route</span>
                <span className="font-semibold">
                  {route.from} → {route.to}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Passengers</span>
                <span className="font-semibold">{passengers.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Seats Selected</span>
                <span className="font-semibold">
                  {selectedSeats.length > 0
                    ? selectedSeats.join(", ")
                    : "None selected"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Price per seat</span>
                <span className="font-semibold">NPR {route.price}</span>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span className="text-blue-600">NPR {totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-8">
              <h3 className="font-bold mb-4">Payment Method</h3>
              <div className="space-y-3">
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4 text-blue-600"
                  />
                  <div className="ml-3">
                    <span className="font-medium">Cash Payment</span>
                    <p className="text-sm text-gray-500">
                      Pay when you board the bus
                    </p>
                  </div>
                </label>
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 opacity-50">
                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4 text-blue-600"
                    disabled
                  />
                  <div className="ml-3">
                    <span className="font-medium">Online Payment</span>
                    <p className="text-sm text-gray-500">Coming soon</p>
                  </div>
                </label>
              </div>
            </div>

            <button
              onClick={handleBooking}
              disabled={loading || selectedSeats.length !== passengers.length}
              className={`
                w-full py-3 rounded-lg font-semibold text-lg transition-all duration-200
                ${
                  selectedSeats.length === passengers.length && !loading
                    ? "bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }
              `}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Confirm Booking"
              )}
            </button>

            <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
              <p className="text-sm text-yellow-800">
                <span className="font-semibold">Note:</span> Please ensure all
                details are correct before confirming. Cancellations are allowed
                up to 2 hours before departure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
