import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Calendar, MapPin, Users, CreditCard } from "lucide-react";
import { routesAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import RouteSelector from "../components/booking/RouteSelector";
import SeatSelector from "../components/booking/SeatSelector";
import BookingForm from "../components/booking/BookingForm";
import LoadingSpinner from "../components/common/LoadingSpinner";

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();

  const [step, setStep] = useState(1);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengerInfo, setPassengerInfo] = useState({});
  const [travelDate, setTravelDate] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  const routeId = searchParams.get("route");

  useEffect(() => {
    if (routeId) {
      fetchRouteDetails(routeId);
    }
  }, [routeId]);

  useEffect(() => {
    if (selectedRoute) {
      setTotalAmount(selectedRoute.price * selectedSeats.length);
    }
  }, [selectedRoute, selectedSeats]);

  const fetchRouteDetails = async (id) => {
    setLoading(true);
    try {
      const response = await routesAPI.getById(id);
      setSelectedRoute(response.data);
      setStep(2); // Move to seat selection
    } catch (error) {
      toast.error("Failed to load route details");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRoute = (route) => {
    setSelectedRoute(route);
    setStep(2);
    setSelectedSeats([]);
    setPassengerInfo({});
  };

  const handleSelectSeat = (seatNumber) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seatNumber)) {
        return prev.filter((s) => s !== seatNumber);
      } else {
        return [...prev, seatNumber];
      }
    });
  };

  const handlePassengerInfoChange = (seatNumber, field, value) => {
    setPassengerInfo((prev) => ({
      ...prev,
      [seatNumber]: {
        ...prev[seatNumber],
        [field]: value,
      },
    }));
  };

  const handleDateChange = (e) => {
    setTravelDate(e.target.value);
  };

  const handleNext = () => {
    if (step === 1 && !selectedRoute) {
      toast.error("Please select a route");
      return;
    }

    if (step === 2) {
      if (!travelDate) {
        toast.error("Please select a travel date");
        return;
      }

      if (selectedSeats.length === 0) {
        toast.error("Please select at least one seat");
        return;
      }

      if (!isAuthenticated) {
        toast.error("Please login to continue booking");
        return;
      }
    }

    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const steps = [
    { number: 1, title: "Select Route", icon: MapPin },
    { number: 2, title: "Choose Seats", icon: Users },
    { number: 3, title: "Select Date", icon: Calendar },
    { number: 4, title: "Confirm & Pay", icon: CreditCard },
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="section-container">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between">
          {steps.map((stepItem) => {
            const Icon = stepItem.icon;
            const isActive = step >= stepItem.number;
            const isCompleted = step > stepItem.number;

            return (
              <div key={stepItem.number} className="flex flex-col items-center">
                <div
                  className={`
                  w-12 h-12 rounded-full flex items-center justify-center mb-2
                  ${
                    isActive
                      ? "bg-primary-600 text-white"
                      : "bg-gray-200 text-gray-400"
                  }
                  ${isCompleted ? "bg-green-500 text-white" : ""}
                `}
                >
                  {isCompleted ? "✓" : <Icon className="h-6 w-6" />}
                </div>
                <span
                  className={`text-sm font-medium ${
                    isActive ? "text-primary-600" : "text-gray-500"
                  }`}
                >
                  {stepItem.title}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-4 relative">
          <div className="absolute top-0 left-0 h-1 bg-gray-200 w-full"></div>
          <div
            className="absolute top-0 left-0 h-1 bg-primary-600 transition-all duration-300"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step Content */}
      <div className="card">
        {step === 1 && (
          <RouteSelector
            onSelectRoute={handleSelectRoute}
            selectedDate={travelDate}
          />
        )}

        {step === 2 && selectedRoute && (
          <>
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Selected Route: {selectedRoute.from} → {selectedRoute.to}
              </h3>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{selectedRoute.duration}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{selectedRoute.availableSeats} seats available</span>
                </div>
                <div className="font-semibold text-primary-600">
                  NPR {selectedRoute.price} per seat
                </div>
              </div>
            </div>

            <SeatSelector
              totalSeats={selectedRoute.totalSeats}
              bookedSeats={[]} // You would fetch booked seats for the selected date
              selectedSeats={selectedSeats}
              onSelectSeat={handleSelectSeat}
              onPassengerInfoChange={handlePassengerInfoChange}
            />
          </>
        )}

        {step === 3 && (
          <div className="text-center py-8">
            <Calendar className="h-16 w-16 text-primary-600 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-4">Select Travel Date</h3>
            <p className="text-gray-600 mb-8">
              Choose your preferred travel date
            </p>

            <div className="max-w-md mx-auto">
              <input
                type="date"
                value={travelDate}
                onChange={handleDateChange}
                min={new Date().toISOString().split("T")[0]}
                className="input-field text-lg text-center"
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                Bookings available for the next 30 days
              </p>
            </div>
          </div>
        )}

        {step === 4 && selectedRoute && (
          <BookingForm
            route={selectedRoute}
            selectedSeats={selectedSeats}
            passengerInfo={passengerInfo}
            travelDate={travelDate}
            totalAmount={totalAmount}
          />
        )}

        {/* Navigation Buttons */}
        {step < 4 && (
          <div className="flex justify-between mt-8 pt-6 border-t">
            {step > 1 && (
              <button onClick={handleBack} className="btn-secondary">
                Back
              </button>
            )}
            <button onClick={handleNext} className="btn-primary ml-auto">
              {step === 3 ? "Continue to Payment" : "Next"}
            </button>
          </div>
        )}
      </div>

      {/* Booking Summary Sidebar (for steps 2-4) */}
      {step >= 2 && selectedRoute && (
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Route:</span>
              <span className="font-medium">
                {selectedRoute.from} → {selectedRoute.to}
              </span>
            </div>
            {travelDate && (
              <div className="flex justify-between">
                <span className="text-gray-600">Travel Date:</span>
                <span className="font-medium">
                  {new Date(travelDate).toLocaleDateString()}
                </span>
              </div>
            )}
            {selectedSeats.length > 0 && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">Seats:</span>
                  <span className="font-medium">
                    {selectedSeats.join(", ")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Passengers:</span>
                  <span className="font-medium">{selectedSeats.length}</span>
                </div>
              </>
            )}
            <div className="border-t pt-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Price per seat:</span>
                <span>NPR {selectedRoute.price}</span>
              </div>
              <div className="flex justify-between text-lg font-bold mt-2">
                <span>Total Amount:</span>
                <span className="text-primary-600">NPR {totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
