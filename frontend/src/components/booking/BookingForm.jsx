import {
  CreditCard,
  User,
  Mail,
  MapPin,
  Calendar,
  CheckCircle,
  Phone,
} from "lucide-react";

const BookingForm = ({
  bus,
  selectedSeats,
  travelDate,
  totalAmount,
  bookerDetails,
  onBookerInfoChange,
  onConfirm,
  isProcessing,
}) => {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Booker Info & Payment */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-primary-600" /> Booker Details
          </h3>
          <div className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={bookerDetails.name}
              onChange={onBookerInfoChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={bookerDetails.email}
              onChange={onBookerInfoChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={bookerDetails.phone}
              onChange={onBookerInfoChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Payment Method
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {["esewa", "khalti", "card", "cash"].map((method) => (
              <label
                key={method}
                className={`p-3 border rounded-xl cursor-pointer transition-all flex items-center justify-between ${bookerDetails.paymentMethod === method ? "border-primary-600 bg-primary-50" : "border-gray-200"}`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method}
                  className="sr-only"
                  onChange={onBookerInfoChange}
                />
                <span className="capitalize">
                  {method === "cash" ? "Cash on Bus" : method}
                </span>
                {bookerDetails.paymentMethod === method && (
                  <CheckCircle className="h-4 w-4 text-primary-600" />
                )}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 p-6 rounded-xl border">
        <h3 className="font-bold mb-4">Summary</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p className="flex justify-between">
            <span>Bus:</span>{" "}
            <span className="text-gray-900">{bus.busName}</span>
          </p>
          <p className="flex justify-between">
            <span>Seats:</span>{" "}
            <span className="text-gray-900">{selectedSeats.join(", ")}</span>
          </p>
          <p className="flex justify-between">
            <span>Date:</span>{" "}
            <span className="text-gray-900">{travelDate}</span>
          </p>
          <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg text-primary-700">
            <span>Total:</span> <span>NPR {totalAmount}</span>
          </div>
        </div>

        <button
          onClick={onConfirm}
          disabled={isProcessing || !bookerDetails.paymentMethod}
          className={`w-full mt-6 py-3 rounded-lg text-white font-bold transition-all ${
            isProcessing
              ? "bg-gray-400"
              : "bg-green-600 hover:bg-green-700 shadow-md"
          }`}
        >
          {isProcessing
            ? "Processing..."
            : bookerDetails.paymentMethod === "cash"
              ? "Confirm Booking"
              : `Pay NPR ${totalAmount}`}
        </button>
      </div>
    </div>
  );
};

export default BookingForm;
