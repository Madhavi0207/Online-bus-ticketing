import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Calendar, MapPin, Users, CreditCard } from "lucide-react";
import busesAPI from "../services/busesAPI";
import bookingsAPI from "../services/api";
import LoadingSpinner from "../components/common/LoadingSpinner";
import SeatSelector from "../components/booking/SeatSelector";
import BookingForm from "../components/booking/BookingForm";

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const busId = searchParams.get("bus");

  const [step, setStep] = useState(1);
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengerInfo, setPassengerInfo] = useState({});
  const [travelDate, setTravelDate] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch bus details on mount
  useEffect(() => {
    if (busId) fetchBusDetails(busId);
  }, [busId]);

  // Calculate total amount whenever seats change
  useEffect(() => {
    if (selectedBus) {
      setTotalAmount(selectedBus.price * selectedSeats.length);
    }
  }, [selectedSeats, selectedBus]);

  // Fetch bus details
  const fetchBusDetails = async (id) => {
    setLoading(true);
    try {
      const res = await busesAPI.getById(id);
      setSelectedBus(res.data);
      setStep(2); // move to seat selection
    } catch (err) {
      console.error(err);
      toast.error("Failed to load bus details.");
    } finally {
      setLoading(false);
    }
  };

  // Seat selection handler
  const handleSelectSeat = (seatNumber) => {
    setSelectedSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((s) => s !== seatNumber)
        : [...prev, seatNumber],
    );
  };

  // Passenger info handler
  const handlePassengerInfoChange = (seatNumber, field, value) => {
    setPassengerInfo((prev) => ({
      ...prev,
      [seatNumber]: { ...prev[seatNumber], [field]: value },
    }));
  };

  // Travel date handler
  const handleDateChange = (e) => setTravelDate(e.target.value);

  // Navigation
  const handleNext = () => {
    if (step === 2 && selectedSeats.length === 0) {
      toast.error("Please select at least one seat.");
      return;
    }
    if (step === 3 && !travelDate) {
      toast.error("Please select a travel date.");
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  // Final booking submission
  const handleConfirmBooking = async () => {
    if (!selectedBus || selectedSeats.length === 0 || !travelDate) return;

    setLoading(true);
    try {
      const payload = {
        busId: selectedBus._id,
        seats: selectedSeats,
        travelDate,
        passengers: passengerInfo,
        totalAmount,
      };
      const res = await bookingsAPI.create(payload);
      toast.success("Booking successful!");
      // Optionally redirect to MyBookings page
      window.location.href = "/my-bookings";
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Booking failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading || !selectedBus) return <LoadingSpinner />;

  // Get booked seats for seat selector
  const bookedSeats = selectedBus.seats
    ?.filter((seat) => seat.isBooked)
    .map((seat) => seat.seatNumber);

  return (
    <div className="section-container">
      {/* Step Navigation */}
      <div className="mb-8 flex justify-between">
        {["Select Seats", "Select Date", "Confirm & Pay"].map(
          (title, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                  step > index
                    ? "bg-primary-600 text-white"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {index + 1}
              </div>
              <span
                className={`text-sm font-medium ${step > index ? "text-primary-600" : "text-gray-500"}`}
              >
                {title}
              </span>
            </div>
          ),
        )}
      </div>

      {/* Step Content */}
      <div className="card p-6">
        {/* Step 2: Seat Selection */}
        {step === 2 && (
          <>
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
          </>
        )}

        {/* Step 3: Select Date */}
        {step === 3 && (
          <div className="text-center py-8">
            <Calendar className="h-16 w-16 text-primary-600 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-4">Select Travel Date</h3>
            <input
              type="date"
              value={travelDate}
              onChange={handleDateChange}
              min={new Date().toISOString().split("T")[0]}
              className="input-field text-lg text-center"
            />
          </div>
        )}

        {/* Step 4: Confirm & Pay */}
        {step === 4 && (
          <BookingForm
            bus={selectedBus}
            selectedSeats={selectedSeats}
            passengerInfo={passengerInfo}
            travelDate={travelDate}
            totalAmount={totalAmount}
            onConfirm={handleConfirmBooking}
          />
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          {step > 2 && (
            <button className="btn-secondary" onClick={handleBack}>
              Back
            </button>
          )}
          {step < 4 && (
            <button className="btn-primary ml-auto" onClick={handleNext}>
              {step === 3 ? "Confirm & Pay" : "Next"}
            </button>
          )}
        </div>
      </div>

      {/* Booking Summary Sidebar */}
      {step >= 2 && (
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Route:</span>
              <span>
                {selectedBus?.route?.from} → {selectedBus?.route?.to}
              </span>
            </div>
            {travelDate && (
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{new Date(travelDate).toLocaleDateString()}</span>
              </div>
            )}
            {selectedSeats.length > 0 && (
              <div className="flex justify-between">
                <span>Seats:</span>
                <span>{selectedSeats.join(", ")}</span>
              </div>
            )}
            <div className="border-t pt-3 flex justify-between font-bold text-lg">
              <span>Total Amount:</span>
              <span className="text-primary-600">NPR {totalAmount}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
