import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-hot-toast";

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const bookingId = params.get("bookingId");
  const pidx = params.get("pidx");

  useEffect(() => {
    if (bookingId && pidx) {
      api
        .post("/payment/khalti/verify", { bookingId, pidx })
        .then((res) => toast.success("Payment Successful!"))
        .catch((err) => toast.error("Payment verification failed."));
    }
  }, []);

  return (
    <h2 className="text-green-600 text-center mt-20 text-2xl">
      Payment Successful 🎉
    </h2>
  );
};

export default PaymentSuccess;
