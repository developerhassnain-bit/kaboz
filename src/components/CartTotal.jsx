import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";

const CartTotal = ({ variant = "dark" }) => {
  const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);
  const subtotal = Number(getCartAmount()) || 0;
  const shipping = subtotal === 0 ? 0 : Number(delivery_fee) || 0;
  const total = subtotal + shipping;
  const dark = variant === "dark";

  return (
    <div className="w-full">
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-kaboz-orange">
        Summary
      </p>
      <h2
        className={`mt-1 font-display text-xl font-bold ${
          dark ? "text-white" : "text-kaboz-ink"
        }`}
      >
        Cart totals
      </h2>

      <div className="mt-5 space-y-3 text-sm">
        <div
          className={`flex justify-between ${
            dark ? "text-white/65" : "text-kaboz-mute"
          }`}
        >
          <span>Subtotal</span>
          <span>
            {currency}
            {subtotal.toFixed(2)}
          </span>
        </div>
        <div
          className={`flex justify-between ${
            dark ? "text-white/65" : "text-kaboz-mute"
          }`}
        >
          <span>Shipping fee</span>
          <span>
            {currency}
            {shipping.toFixed(2)}
          </span>
        </div>
        <div
          className={`flex justify-between border-t pt-3 text-base font-bold ${
            dark
              ? "border-white/15 text-white"
              : "border-kaboz-line text-kaboz-ink"
          }`}
        >
          <span>Total</span>
          <span className="text-kaboz-price">
            {currency}
            {total.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
