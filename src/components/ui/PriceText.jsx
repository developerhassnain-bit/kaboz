import React from "react";

/**
 * Renders a price with a slightly smaller currency prefix (e.g. AED).
 */
const PriceText = ({ currency = "AED ", amount }) => (
  <>
    <span className="text-[0.72em] font-semibold tracking-normal">
      {currency}
    </span>
    {amount}
  </>
);

export default PriceText;
