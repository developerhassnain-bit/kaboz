import React from "react";

/** Shared SVG icons — prefer these over Unicode glyphs in UI chrome. */

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

export const IconChevronRight = ({
  className = "h-3.5 w-3.5",
  strokeWidth = 2,
}) => (
  <svg viewBox="0 0 24 24" className={className} {...base} strokeWidth={strokeWidth}>
    <path d="M9 6l6 6-6 6" />
  </svg>
);

export const IconChevronLeft = ({
  className = "h-3.5 w-3.5",
  strokeWidth = 2,
}) => (
  <svg viewBox="0 0 24 24" className={className} {...base} strokeWidth={strokeWidth}>
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

export const IconChevronDown = ({ className = "h-3.5 w-3.5" }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export const IconChevronUp = ({ className = "h-3.5 w-3.5" }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M18 15l-6-6-6 6" />
  </svg>
);

export const IconArrowRight = ({ className = "h-3.5 w-3.5" }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const IconArrowLeft = ({ className = "h-3.5 w-3.5" }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M19 12H5M11 18l-6-6 6-6" />
  </svg>
);

export const IconCheck = ({ className = "h-3.5 w-3.5" }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M5 12l5 5L20 7" />
  </svg>
);

export const IconClose = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const IconSearch = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </svg>
);

export const IconEye = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const IconCompare = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M16 3l4 4-4 4" />
    <path d="M20 7H10a4 4 0 00-4 4v2" />
    <path d="M8 21l-4-4 4-4" />
    <path d="M4 17h10a4 4 0 004-4v-2" />
  </svg>
);

export const IconHeart = ({ className = "h-4 w-4", filled = false }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden
  >
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
  </svg>
);

export const IconCart = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L21 8H6" />
    <circle cx="10" cy="20" r="1" />
    <circle cx="18" cy="20" r="1" />
  </svg>
);

export const IconUser = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5" />
  </svg>
);

export const IconMenu = ({ className = "h-5 w-5" }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const IconGrid = ({ className = "h-3.5 w-3.5" }) => (
  <span className={`grid grid-cols-3 gap-[2px] ${className}`} aria-hidden>
    {Array.from({ length: 6 }).map((_, i) => (
      <span key={i} className="h-[3px] w-[3px] rounded-[0.5px] bg-current" />
    ))}
  </span>
);
