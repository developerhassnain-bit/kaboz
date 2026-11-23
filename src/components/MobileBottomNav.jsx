import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { getWishlistCount, WISHLIST_EVENT } from "../utils/wishlist";

const Item = ({ to, label, active, children, badge, onClick }) => {
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`relative flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-semibold ${
          active ? "text-kaboz-purple" : "text-kaboz-mute"
        }`}
      >
        <span className="relative">
          {children}
          {badge > 0 ? (
            <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-kaboz-red px-1 text-[9px] font-bold text-white">
              {badge > 99 ? "99+" : badge}
            </span>
          ) : null}
        </span>
        {label}
      </button>
    );
  }

  return (
    <Link
      to={to}
      className={`relative flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-semibold ${
        active ? "text-kaboz-purple" : "text-kaboz-mute"
      }`}
    >
      <span className="relative">
        {children}
        {badge > 0 ? (
          <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-kaboz-red px-1 text-[9px] font-bold text-white">
            {badge > 99 ? "99+" : badge}
          </span>
        ) : null}
      </span>
      {label}
    </Link>
  );
};

/** Onsus-style mobile bottom menu — hidden on Living hub and login. */
const MobileBottomNav = () => {
  const { pathname } = useLocation();
  const { getCartCount, token, openCartDrawer } = useContext(ShopContext);
  const [wishlistCount, setWishlistCount] = useState(() => getWishlistCount());

  useEffect(() => {
    const sync = () => setWishlistCount(getWishlistCount());
    window.addEventListener(WISHLIST_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(WISHLIST_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  if (pathname === "/login" || pathname === "/living") return null;

  const cartCount = getCartCount();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-[90] border-t border-kaboz-line bg-white/95 backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Mobile quick links"
    >
      <div className="flex items-stretch">
        <Item to="/" label="Home" active={pathname === "/"}>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M3 11.5 12 4l9 7.5" />
            <path d="M6 10.5V20h12v-9.5" />
          </svg>
        </Item>
        <Item
          to="/collection"
          label="Shop"
          active={pathname.startsWith("/collection") || pathname.startsWith("/product")}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 7h16l-1.2 12.2a2 2 0 01-2 1.8H7.2a2 2 0 01-2-1.8L4 7z" />
            <path d="M9 7a3 3 0 016 0" />
          </svg>
        </Item>
        <Item
          to="/wishlist"
          label="Wishlist"
          active={pathname === "/wishlist"}
          badge={wishlistCount}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill={wishlistCount > 0 ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z" />
          </svg>
        </Item>
        <Item onClick={openCartDrawer} label="Cart" active={pathname === "/cart"} badge={cartCount}>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M3 4h2l2.4 11.2a2 2 0 002 1.6h7.8a2 2 0 001.9-1.4L21 8H6" />
            <circle cx="10" cy="20" r="1" />
            <circle cx="18" cy="20" r="1" />
          </svg>
        </Item>
        <Item
          to={token ? "/orders" : "/login"}
          label="Account"
          active={pathname === "/login" || pathname === "/orders"}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="8" r="3.5" />
            <path d="M5 19.5c1.8-3.2 4.2-4.5 7-4.5s5.2 1.3 7 4.5" />
          </svg>
        </Item>
      </div>
    </nav>
  );
};

export default MobileBottomNav;
