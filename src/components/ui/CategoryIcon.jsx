import React from "react";

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

/** CCTV / Surveillance bullet camera */
export const IconCctv = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <rect x="2" y="7" width="13" height="9" rx="2" />
    <path d="m15 10 5-3v10l-5-3" />
    <circle cx="7" cy="11.5" r="2.25" />
    <path d="M5 16v3" />
    <path d="M3 19h4" />
  </svg>
);

/** Access Control — Keycard / RFID Badge with Security Lock */
export const IconAccessControl = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <rect x="5" y="2" width="14" height="20" rx="3" />
    <path d="M9 6h6" />
    <rect x="8.5" y="11" width="7" height="6" rx="1" />
    <path d="M10 11V9a2 2 0 1 1 4 0v2" />
  </svg>
);

/** Video Intercom — Indoor Station Display Monitor with speaker */
export const IconVideoIntercom = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <rect x="2" y="3" width="20" height="15" rx="2" />
    <circle cx="8" cy="9" r="2" />
    <path d="M5 15c0-1.8 1.5-2.8 3-2.8s3 1 3 2.8" />
    <path d="M15 7.5h3" />
    <path d="M15 10.5h3" />
    <path d="M15 13.5h2" />
    <path d="M9 21h6" />
    <path d="M12 18v3" />
  </svg>
);

/** Network Switches — Rackmount PoE Switch with RJ45 ports and LEDs */
export const IconNetworkSwitch = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <rect x="5" y="12" width="3" height="3" rx="0.5" />
    <rect x="10.5" y="12" width="3" height="3" rx="0.5" />
    <rect x="16" y="12" width="3" height="3" rx="0.5" />
    <circle cx="6.5" cy="9" r="0.75" fill="currentColor" stroke="none" />
    <circle cx="12" cy="9" r="0.75" fill="currentColor" stroke="none" />
    <circle cx="17.5" cy="9" r="0.75" fill="currentColor" stroke="none" />
  </svg>
);

/** Kits — Complete Security System Bundle / Box */
export const IconKits = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 12v9.5" />
  </svg>
);

/** Software License — Official Certificate Document with Key */
export const IconSoftwareLicense = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
    <circle cx="10" cy="14.5" r="2" />
    <path d="m11.5 16 3 3" />
    <path d="m13.5 18 1.5-1.5" />
  </svg>
);

/** Accessories — Cables, Power Adapter & Connectors */
export const IconAccessories = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M9 2v4M15 2v4" />
    <rect x="6" y="6" width="12" height="7" rx="2" />
    <path d="M12 13v4a3 3 0 0 0 3 3h3" />
  </svg>
);

/** Curtains */
export const IconCurtains = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M2 4h20" />
    <path d="M5 4v16c1.5-1 3-1 4.5 0V4" />
    <path d="M19 4v16c-1.5-1-3-1-4.5 0V4" />
  </svg>
);

/** Bedsheets */
export const IconBedsheets = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M2 17v4M22 17v4" />
    <path d="M2 9h20v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9z" />
    <path d="M6 9V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4" />
  </svg>
);

/** Luxury Bedsheets */
export const IconLuxuryBedsheets = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M2 17v4M22 17v4" />
    <path d="M2 10h20v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7z" />
    <path d="M12 3l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" />
  </svg>
);

/** Upholstery */
export const IconUpholstery = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3" />
    <path d="M3 13v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3z" />
    <path d="M6 20v2M18 20v2" />
  </svg>
);

/** Default category icon */
export const IconDefaultCategory = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
  </svg>
);

/**
 * Returns a dedicated category SVG icon based on category name.
 */
export const CategoryDepartmentIcon = ({ name = "", className = "h-4 w-4" }) => {
  const n = (name || "").toLowerCase().trim();

  if (n.includes("cctv") || n.includes("camera") || n.includes("security")) {
    return <IconCctv className={className} />;
  }
  if (n.includes("access")) {
    return <IconAccessControl className={className} />;
  }
  if (n.includes("intercom")) {
    return <IconVideoIntercom className={className} />;
  }
  if (n.includes("network") || n.includes("switch")) {
    return <IconNetworkSwitch className={className} />;
  }
  if (n.includes("kit")) {
    return <IconKits className={className} />;
  }
  if (n.includes("software") || n.includes("license")) {
    return <IconSoftwareLicense className={className} />;
  }
  if (n.includes("accessor")) {
    return <IconAccessories className={className} />;
  }
  if (n.includes("curtain")) {
    return <IconCurtains className={className} />;
  }
  if (n.includes("luxury")) {
    return <IconLuxuryBedsheets className={className} />;
  }
  if (n.includes("bed")) {
    return <IconBedsheets className={className} />;
  }
  if (n.includes("upholster")) {
    return <IconUpholstery className={className} />;
  }

  return <IconDefaultCategory className={className} />;
};

export default CategoryDepartmentIcon;
