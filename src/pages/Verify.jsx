import React, { useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const Verify = () => {
  const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext);
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");

  const verifyPayment = async () => {
    try {
      if (!token) {
        return null;
      }
      const response = await axios.post(
        backendUrl + "/api/order/verifyStripe",
        { success, orderId },
        { headers: { token } }
      );
      if (response.data.success) {
        setCartItems({});
        navigate("/orders");
      } else {
        navigate("/cart");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    verifyPayment();
  }, [token]);

  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center px-4 py-16 text-center">
      <span className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-kaboz-line border-t-kaboz-purple" />
      <p className="mt-4 font-display text-lg font-bold text-kaboz-ink">
        Verifying payment…
      </p>
      <p className="mt-1 text-sm text-kaboz-mute">
        Please wait while we confirm your Stripe checkout.
      </p>
    </div>
  );
};

export default Verify;
