import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Calendar } from "lucide-react";
import busesAPI from "../services/busesAPI";
import bookingsAPI from "../services/api";
import LoadingSpinner from "../components/common/LoadingSpinner";
import SeatSelector from "../components/booking/SeatSelector";
import BookingForm from "../components/booking/BookingForm";

const MAX_SEATS_PER_BOOKING = 6;

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const busId = searchParams.get("bus");

  const [step, setStep] = useState(1);
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [travelDate, setTravelDate] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Single booker details state (replacing per-passenger info)
  const [bookerDetails, setBookerDetails] = useState({
    name: "",
    email: "",
    phone: "",
    paymentMethod: "esewa", // Default payment method
  });

  // Fetch bus details on mount
  useEffect(() => {
    if (busId) fetchBusDetails(busId);
  }, [busId]);

  // Calculate total amount
  useEffect(() => {
    if (selectedBus) {
      setTotalAmount(selectedBus.price * selectedSeats.length);
    }
  }, [selectedSeats, selectedBus]);

  const fetchBusDetails = async (id) => {
    setLoading(true);
    try {
      const res = await busesAPI.getById(id);
      setSelectedBus(res.data);
      setStep(2); // Move to seat selection immediately if bus found
    } catch (err) {
      console.error(err);
      toast.error("Failed to load bus details.");
    } finally {
      setLoading(false);
    }
  };

  // Seat selection handler with MAX limit check
  const handleSelectSeat = (seatNumber) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seatNumber)) {
        return prev.filter((s) => s !== seatNumber);
      } else {
        if (prev.length >= MAX_SEATS_PER_BOOKING) {
          toast.error(
            `You can only book up to ${MAX_SEATS_PER_BOOKING} seats.`,
          );
          return prev;
        }
        return [...prev, seatNumber];
      }
    });
  };

  const handleDateChange = (e) => setTravelDate(e.target.value);

  // Handle Input Change for Booker Details
  const handleBookerInfoChange = (e) => {
    const { name, value } = e.target;
    setBookerDetails((prev) => ({ ...prev, [name]: value }));
  };

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

  // Final Payment & Booking Submission
  // const handleConfirmBooking = async () => {
  //   // 1. Validate Form
  //   if (!bookerDetails.name || !bookerDetails.email || !bookerDetails.phone) {
  //     toast.error("Please fill in all booker details.");
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     // 2. Prepare Payload
  //     const payload = {
  //       busId,
  //       seats: selectedSeats,
  //       travelDate,
  //       bookerName: bookerDetails.name,
  //       bookerEmail: bookerDetails.email,
  //       bookerPhone: bookerDetails.phone,
  //       paymentMethod: bookerDetails.paymentMethod,
  //       totalAmount,
  //     };

  //     // 3. Call API
  //     // Note: In a real app, you might redirect to a payment gateway here
  //     // and call the create booking API after success/webhook.
  //     const res = await bookingsAPI.create(payload);

  //     toast.success("Booking confirmed successfully!");
  //     navigate("/my-bookings");
  //   } catch (err) {
  //     console.error(err);
  //     const msg =
  //       err.response?.data?.message || "Booking failed. Please try again.";
  //     toast.error(msg);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleConfirmBooking = async () => {
    setLoading(true);
    try {
      const payload = {
        busId: selectedBus._id,
        routeId: selectedBus.route._id,
        travelDate: travelDate,
        selectedSeats: selectedSeats, // The array of strings [ "A1", "B2" ]
        totalAmount: totalAmount,
        // The single point of contact
        bookerName: bookerDetails.name,
        bookerEmail: bookerDetails.email,
        bookerPhone: bookerDetails.phone,
      };

      const res = await bookingsAPI.create(payload);
      toast.success("Booking Request Sent!");
      navigate("/my-bookings");
    } catch (err) {
      toast.error("Booking failed to save.");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !selectedBus) return <LoadingSpinner />;

  const bookedSeats = selectedBus.seats
    ?.filter((seat) => seat.isBooked)
    .map((seat) => seat.seatNumber);

  return (
    <div className="section-container max-w-4xl mx-auto px-4 py-8">
      {/* Step Navigation */}
      <div className="mb-8 flex justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 -z-10 transform -translate-y-1/2"></div>

        {["Select Seats", "Select Date", "Payment"].map((title, index) => {
          // index 0 = Seat Selection (Step 2)
          // index 1 = Date Selection (Step 3)
          // index 2 = Payment (Step 4)
          const currentStepValue = index + 2;
          const isActive = step >= currentStepValue;
          const isCompleted = step > currentStepValue;

          return (
            <div
              key={index}
              className="flex flex-col items-center bg-white px-2"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 font-bold transition-all duration-300 ${
                  isActive
                    ? "bg-primary-600 text-white ring-4 ring-primary-100"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {/* This renders 1, 2, or 3 inside the circle */}
                {index + 1}
              </div>
              <span
                className={`text-xs md:text-sm font-medium ${
                  isActive ? "text-primary-600" : "text-gray-500"
                }`}
              >
                {title}
              </span>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 min-h-[400px]">
        {/* Step 2: Seat Selection */}
        {step === 2 && (
          <>
            <div className="mb-6 flex justify-between items-end border-b pb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {selectedBus?.route?.from} → {selectedBus?.route?.to}
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  Price:{" "}
                  <span className="text-primary-600 font-bold">
                    NPR {selectedBus.price}
                  </span>{" "}
                  / seat
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  Max {MAX_SEATS_PER_BOOKING} seats
                </span>
              </div>
            </div>

            <SeatSelector
              totalSeats={selectedBus.totalSeats}
              bookedSeats={bookedSeats}
              selectedSeats={selectedSeats}
              onSelectSeat={handleSelectSeat}
            />
          </>
        )}

        {/* Step 3: Select Date */}
        {step === 3 && (
          <div className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-16 w-16 text-primary-600 mb-6" />
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              When are you traveling?
            </h3>
            <input
              type="date"
              value={travelDate}
              onChange={handleDateChange}
              min={new Date().toISOString().split("T")[0]}
              className="px-6 py-3 text-lg border-2 border-primary-100 rounded-lg focus:border-primary-600 focus:ring-0 outline-none shadow-sm"
            />
          </div>
        )}

        {/* Step 4: Final Review & Payment */}
        {step === 4 && (
          <BookingForm
            bus={selectedBus}
            selectedSeats={selectedSeats}
            travelDate={travelDate}
            totalAmount={totalAmount}
            bookerDetails={bookerDetails}
            onBookerInfoChange={handleBookerInfoChange}
            onConfirm={handleConfirmBooking}
            isProcessing={loading}
          />
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-4 border-t">
          {step > 2 && (
            <button
              className="px-6 py-2 rounded border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium"
              onClick={handleBack}
              disabled={loading}
            >
              Back
            </button>
          )}

          {step < 4 && (
            <button
              className="ml-auto px-6 py-2 bg-primary-600 text-black rounded hover:bg-primary-700 font-medium shadow-md hover:shadow-lg transition-all"
              onClick={handleNext}
            >
              {step === 3 ? "Proceed to Payment" : "Next"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
