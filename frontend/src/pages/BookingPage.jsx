import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Calendar } from "lucide-react";
import busesAPI from "../services/busesAPI";
import { bookingsAPI } from "../services/api";
import LoadingSpinner from "../components/common/LoadingSpinner";
import SeatSelector from "../components/booking/SeatSelector";
import BookingForm from "../components/booking/BookingForm";
import { useAuth } from "../context/AuthContext";

const MAX_SEATS_PER_BOOKING = 6;

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const busId = searchParams.get("bus");

  const { user } = useAuth();

  const [step, setStep] = useState(2); // Start at 2 (Seat Selection)
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [travelDate, setTravelDate] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [bookerDetails, setBookerDetails] = useState({
    name: "",
    email: "",
    phone: "",
    paymentMethod: "",
  });

  useEffect(() => {
    if (busId) fetchBusDetails(busId);
  }, [busId]);

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
    } catch (err) {
      toast.error("Failed to load bus details.");
    } finally {
      setLoading(false);
    }
  };

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

  const handleConfirmBooking = async () => {
    if (!bookerDetails.name || !bookerDetails.email || !bookerDetails.phone) {
      toast.error("Please fill in all booker details.");
      return;
    }

    if (!travelDate) {
      toast.error("Please select a travel date.");
      return;
    }

    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat.");
      return;
    }

    if (!bookerDetails.paymentMethod) {
      toast.error("Please select a payment method.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        userId: user._id,
        busId: selectedBus._id,
        route: selectedBus.route?._id,
        selectedSeats,
        travelDate,
        bookerName: bookerDetails.name,
        bookerEmail: bookerDetails.email,
        bookerPhone: bookerDetails.phone,
        paymentMethod: bookerDetails.paymentMethod,
        totalAmount,
      };

      const res = await bookingsAPI.create(payload);

      toast.success(
        bookerDetails.paymentMethod === "cash"
          ? "Booking reserved! Pay when you board."
          : "Booking confirmed successfully!",
      );

      navigate("/my-bookings");
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Booking failed.";
      toast.error(errorMsg);
      console.error("Booking Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !selectedBus) return <LoadingSpinner />;

  const bookedSeats =
    selectedBus.seats
      ?.filter((seat) => seat.isBooked)
      .map((seat) => seat.seatNumber) || [];

  return (
    <div className="section-container max-w-4xl mx-auto px-4 py-8">
      {/* Step Navigation */}
      <div className="mb-10 flex justify-between relative max-w-md mx-auto">
        <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200 -z-10 transform -translate-y-1/2"></div>
        {["Seats", "Date", "Payment"].map((title, index) => {
          const currentStepValue = index + 2;
          const isActive = step >= currentStepValue;
          return (
            <div
              key={index}
              className="flex flex-col items-center relative z-10 bg-white px-3"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all border-2 ${
                  isActive
                    ? "bg-primary-600 border-primary-600 text-white ring-4 ring-white"
                    : "bg-white border-gray-300 text-gray-400"
                }`}
              >
                <span className="leading-none">{index + 1}</span>
              </div>
              <span
                className={`text-xs mt-2 font-semibold uppercase ${
                  isActive ? "text-primary-600" : "text-gray-400"
                }`}
              >
                {title}
              </span>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        {step === 2 && (
          <SeatSelector
            totalSeats={selectedBus.totalSeats}
            bookedSeats={bookedSeats}
            selectedSeats={selectedSeats}
            onSelectSeat={handleSelectSeat}
          />
        )}

        {step === 3 && (
          <div className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-16 w-16 text-primary-600 mb-6" />
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Select Travel Date
            </h3>
            <input
              type="date"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="px-6 py-3 border-2 border-primary-100 rounded-lg outline-none"
            />
          </div>
        )}

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

        <div className="flex justify-between mt-8 pt-4 border-t">
          {step > 2 && (
            <button
              className="text-gray-600"
              onClick={handleBack}
              disabled={loading}
            >
              Back
            </button>
          )}
          {step < 4 && (
            <button
              className="ml-auto bg-primary-600 text-black px-8 py-2 rounded-lg"
              onClick={handleNext}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
