import React from "react";

const VARIANTS = {
  sale: "kb-badge-sale",
  new: "kb-badge-new",
  best: "kb-badge-best",
  soft: "kb-badge-soft",
  outline: "kb-badge-outline",
};

/**
 * Product / UI badge. Prefer semantic variants over one-off colors.
 */
const Badge = ({ children, variant = "soft", className = "", ...rest }) => (
  <span className={`${VARIANTS[variant] || VARIANTS.soft} ${className}`} {...rest}>
    {children}
  </span>
);

export default Badge;
