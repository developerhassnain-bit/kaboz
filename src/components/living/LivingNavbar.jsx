import React from "react";
import { Link, NavLink } from "react-router-dom";
import { assets } from "../../assets/assets";
import { LIVING_HUB_PATH, LIVING_SHOP_PATHS } from "../../utils/categoryLinks";

const LIVING_NAV = [
  { label: "Home", to: LIVING_HUB_PATH },
  { label: "Curtains", to: LIVING_SHOP_PATHS.Curtains },
  { label: "Bedsheets", to: LIVING_SHOP_PATHS.Bedsheets },
  { label: "Luxury Bedsheets", to: LIVING_SHOP_PATHS["Luxury Bedsheets"] },
  { label: "Upholstery", to: LIVING_SHOP_PATHS.Upholstery },
  { label: "Contact", to: "/contact" },
];

/** Dark Kaboz Living microsite header */
const LivingNavbar = () => (
  <header className="bg-kaboz-ink text-white">
    <div className="kb-container flex items-center justify-between gap-3 py-3 sm:gap-4 sm:py-3.5">
      <Link
        to={LIVING_HUB_PATH}
        className="flex shrink-0 items-center"
        aria-label="Kaboz Living"
      >
        <img src={assets.logoOnDark} alt="Kaboz" className="h-9 w-auto sm:h-10" />
      </Link>

      <nav
        aria-label="Kaboz Living"
        className="living-nav-enter flex flex-1 items-center justify-center"
      >
        <ul className="flex flex-wrap items-center justify-center gap-x-1 gap-y-1 sm:gap-x-2">
          {LIVING_NAV.map((item) => (
            <li key={item.label}>
              <NavLink
                to={item.to}
                end={item.to === LIVING_HUB_PATH}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-md px-2 py-1.5 text-xs font-medium transition sm:px-3 sm:text-sm ${
                    isActive
                      ? "text-kaboz-gold"
                      : "text-white/90 hover:text-kaboz-gold"
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <Link
        to="/contact"
        className="hidden shrink-0 rounded-md bg-kaboz-gold px-4 py-2 text-xs font-bold text-kaboz-ink transition hover:bg-kaboz-gold-dark hover:text-white sm:inline-flex"
      >
        Book consult
      </Link>
    </div>
  </header>
);

export default LivingNavbar;
