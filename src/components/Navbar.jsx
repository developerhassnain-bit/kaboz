import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { assets } from "../assets/assets";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { useLanguage } from "../context/LanguageContext";
import useCategories from "../hooks/useCategories";
import HeaderSearch from "./HeaderSearch";
import {
  getCategoryPath,
  getCategoryDisplayName,
  getDepartmentCategories,
  orderNavCategories,
  withoutLivingDuplicates,
} from "../utils/categoryLinks";
import { normalizeCartItems } from "../utils/cartLines";
import { getWishlistCount, WISHLIST_EVENT } from "../utils/wishlist";
import {
  IconArrowRight,
  IconChevronDown,
  IconChevronRight,
  IconClose,
} from "./ui/Icons";

/** Onsus Home 01: Home · Blog · Shop · Page */
const MAIN_LINKS = [
  { to: "/", labelKey: "home" },
  { to: "/collection", labelKey: "shop", mega: true },
  { to: "/services", labelKey: "services" },
  { to: "/about", labelKey: "about" },
  { to: "/contact", labelKey: "contact" },
  { to: "/blog", labelKey: "blog" },
];

const Navbar = () => {
  const { t, languageLabel, setLanguageByLabel, options: langOptions } =
    useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState("menu");
  const [expandedMobileCat, setExpandedMobileCat] = useState(null);
  const [cartPopupOpen, setCartPopupOpen] = useState(false);
  const [catsOpen, setCatsOpen] = useState(false);
  const [pageOpen, setPageOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [activeCatId, setActiveCatId] = useState(null);
  const [wishlistCount, setWishlistCount] = useState(() => getWishlistCount());
  const [accountOpen, setAccountOpen] = useState(false);

  const catsRef = useRef(null);
  const pageRef = useRef(null);
  const langRef = useRef(null);
  const accountRef = useRef(null);
  const mobileCartRef = useRef(null);
  const desktopCartRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const sync = () => setWishlistCount(getWishlistCount());
    window.addEventListener(WISHLIST_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(WISHLIST_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  // Close overlays on route change
  useEffect(() => {
    setCatsOpen(false);
    setPageOpen(false);
    setLangOpen(false);
    setCartPopupOpen(false);
    setAccountOpen(false);
    setMobileOpen(false);
  }, [location.pathname, location.search]);

  const {
    currency,
    delivery_fee,
    cartItems,
    updateQuantity,
    getCartCount,
    getCartAmount,
    token,
    setToken,
    setCartItems,
    products,
  } = useContext(ShopContext);

  const { categories, isLoading: isLoadingCategories } = useCategories();
  const navCategories = getDepartmentCategories(categories);
  const mobileCategories = navCategories;
  const navigate = useNavigate();

  const activeCategory =
    navCategories.find((c) => c._id === activeCatId) || navCategories[0];

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("cartItems");
    setToken("");
    setCartItems({});
    navigate("/login");
  };

  const closeMobile = () => {
    setMobileOpen(false);
    setExpandedMobileCat(null);
  };

  const closeCats = useCallback(() => {
    setCatsOpen(false);
    setActiveCatId(null);
  }, []);

  // Click-outside + Escape for mega menu / account / cart
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        closeCats();
        setPageOpen(false);
        setLangOpen(false);
        setCartPopupOpen(false);
        setAccountOpen(false);
        setMobileOpen(false);
      }
    };
    const onPointer = (e) => {
      if (catsRef.current && !catsRef.current.contains(e.target)) {
        closeCats();
      }
      if (pageRef.current && !pageRef.current.contains(e.target)) {
        setPageOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
      const inMobileCart = mobileCartRef.current?.contains(e.target);
      const inDesktopCart = desktopCartRef.current?.contains(e.target);
      if (!inMobileCart && !inDesktopCart) {
        setCartPopupOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("touchstart", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("touchstart", onPointer);
    };
  }, [closeCats]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  const cartPopupItems = useMemo(() => {
    const normalized = normalizeCartItems(cartItems);
    return Object.entries(normalized)
      .map(([lineKey, line]) => {
        const productInfo = products.find((p) => p._id === line.productId);
        if (!productInfo || line.quantity <= 0) return null;
        return {
          lineKey,
          _id: line.productId,
          name: productInfo.name,
          image: line.colorImage || productInfo.image?.[0],
          price: productInfo.price,
          quantity: line.quantity,
          color: line.color || "",
        };
      })
      .filter(Boolean);
  }, [cartItems, products]);

  const cartCount = getCartCount();
  const cartSubtotal = getCartAmount();
  const cartTotal =
    cartSubtotal + (cartPopupItems.length > 0 ? delivery_fee : 0);

  const NavIconBtn = ({
    label,
    onClick,
    badge,
    showZeroBadge = false,
    children,
    className = "",
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex h-10 w-10 items-center justify-center text-kaboz-ink transition hover:text-kaboz-purple ${className}`}
      aria-label={label}
    >
      {children}
      {badge > 0 || showZeroBadge ? (
        <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-kaboz-red px-1 text-[10px] font-bold leading-none text-white">
          {badge > 99 ? "99+" : badge || 0}
        </span>
      ) : null}
    </button>
  );

  const megaMenu = catsOpen ? (
    <div
      id="kaboz-mega-menu"
      role="menu"
      className="absolute left-0 top-full z-[220] flex w-[min(640px,calc(100vw-2rem))] overflow-hidden rounded-b-[6px] border border-t-0 border-kaboz-line bg-white shadow-mega mega-enter"
    >
      <ul className="w-[240px] flex-shrink-0 border-r border-kaboz-line bg-[#fafafa] py-2">
        {isLoadingCategories ? (
          <li className="px-4 py-3 text-xs text-kaboz-mute">Loading…</li>
        ) : (
          navCategories.map((cat) => {
            const isActive = activeCategory?._id === cat._id;
            return (
              <li key={cat._id}>
                <Link
                  to={cat.href || getCategoryPath(cat.name)}
                  role="menuitem"
                  onMouseEnter={() => setActiveCatId(cat._id)}
                  onFocus={() => setActiveCatId(cat._id)}
                  onClick={closeCats}
                  className={`flex w-full items-center justify-between px-4 py-2.5 text-sm transition ${
                    isActive
                      ? "bg-white font-semibold text-kaboz-purple"
                      : "text-kaboz-slate hover:bg-white hover:text-kaboz-purple"
                  }`}
                >
                  <span className="truncate">
                    {getCategoryDisplayName(cat.name)}
                  </span>
                  {cat.subcategories?.length > 0 ? (
                    <IconChevronRight className="h-3.5 w-3.5 text-kaboz-faint" />
                  ) : null}
                </Link>
              </li>
            );
          })
        )}
        <li className="mt-1 border-t border-kaboz-line">
          <Link
            to="/collection"
            onClick={closeCats}
            className="block px-4 py-2.5 text-sm font-semibold text-kaboz-purple hover:underline"
          >
            <span className="inline-flex items-center gap-1">
              Shop all products
              <IconArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        </li>
      </ul>
      <div className="min-h-[220px] flex-1 bg-white p-4">
        {activeCategory ? (
          <>
            <Link
              to={getCategoryPath(activeCategory.name)}
              onClick={closeCats}
              className="mb-3 block font-display text-base font-bold text-kaboz-ink hover:text-kaboz-purple"
            >
              {getCategoryDisplayName(activeCategory.name)}
            </Link>
            {activeCategory.subcategories?.length > 0 ? (
              <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                {activeCategory.subcategories.map((sub) => (
                  <li key={sub.slug || sub.name}>
                    <Link
                      to={getCategoryPath(activeCategory.filterName || activeCategory.name, sub.slug)}
                      onClick={closeCats}
                      className="block truncate py-1 text-sm text-kaboz-mute hover:text-kaboz-purple"
                    >
                      {sub.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-kaboz-mute">
                Browse all products in this category.
              </p>
            )}
          </>
        ) : (
          <p className="text-sm text-kaboz-mute">Select a category</p>
        )}
      </div>
    </div>
  ) : null;

  return (
    <header className="sticky top-0 z-[100] w-full bg-black shadow-[0_2px_12px_rgba(0,0,0,0.35)] md:bg-white md:shadow-[0_2px_12px_rgba(33,43,54,0.06)]">
      {/* —— 1. Desktop utility bar (white) —— */}
      <div className="hidden border-b border-kaboz-line bg-white text-[12px] text-kaboz-mute md:block">
        <div className="kb-container flex h-10 items-center justify-between gap-4 lg:h-[42px]">
          <p className="inline-flex items-center gap-1.5">
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5 text-kaboz-slate"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              aria-hidden
            >
              <path d="M4 14v-1a8 8 0 0116 0v1" />
              <path d="M4 14a2 2 0 002 2h1v-5H6a2 2 0 00-2 2zM20 14a2 2 0 01-2 2h-1v-5h1a2 2 0 012 2z" />
              <path d="M9 19h6" />
            </svg>
            <span>{t("callUsForFree")}</span>
            <a
              href="tel:+971552693100"
              className="font-semibold text-kaboz-red hover:text-kaboz-red-dark"
            >
              +971 55 269 3100
            </a>
          </p>

          <div className="flex items-center gap-5">
            <div className="relative" ref={langRef}>
              <button
                type="button"
                onClick={() => setLangOpen((v) => !v)}
                aria-expanded={langOpen}
                aria-haspopup="listbox"
                className="inline-flex items-center gap-1.5 hover:text-kaboz-purple"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  aria-hidden
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" />
                </svg>
                <span>
                  {t("language")}{" "}
                  <span className="font-semibold text-kaboz-ink">
                    {languageLabel}
                  </span>
                </span>
                <IconChevronDown className="h-3 w-3 opacity-70" />
              </button>
              {langOpen ? (
                <ul
                  role="listbox"
                  aria-label="Language"
                  className="absolute right-0 top-full z-[210] mt-1 min-w-[140px] overflow-hidden rounded-[4px] border border-kaboz-line bg-white text-kaboz-ink shadow-mega mega-enter"
                >
                  {langOptions.map((opt, i) => (
                    <li
                      key={opt.id}
                      role="option"
                      aria-selected={languageLabel === opt.label}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setLanguageByLabel(opt.label);
                          setLangOpen(false);
                        }}
                        className={`block w-full px-4 py-2.5 text-left text-[13px] transition hover:bg-kaboz-soft hover:text-kaboz-orange ${
                          i > 0 ? "border-t border-kaboz-line" : ""
                        } ${
                          languageLabel === opt.label
                            ? "font-semibold text-kaboz-orange"
                            : "font-normal"
                        }`}
                      >
                        {opt.label}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            {token ? (
              <div className="relative" ref={accountRef}>
                <button
                  type="button"
                  onClick={() => setAccountOpen((v) => !v)}
                  aria-expanded={accountOpen}
                  aria-haspopup="menu"
                  className="inline-flex items-center gap-1.5 font-medium text-kaboz-ink hover:text-kaboz-purple"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    aria-hidden
                  >
                    <circle cx="12" cy="8" r="3.5" />
                    <path d="M5 19.5c1.8-3.2 4.2-4.5 7-4.5s5.2 1.3 7 4.5" />
                  </svg>
                  {t("myAccount")}
                  <IconChevronDown className="h-3 w-3" />
                </button>
                {accountOpen ? (
                  <div
                    role="menu"
                    className="absolute right-0 top-full z-[210] mt-1 w-40 overflow-hidden rounded-[6px] border border-kaboz-line bg-white py-1 text-kaboz-ink shadow-mega mega-enter"
                  >
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setAccountOpen(false);
                        navigate("/orders");
                      }}
                      className="block w-full px-4 py-2 text-left text-sm hover:bg-kaboz-soft hover:text-kaboz-purple"
                    >
                      {t("orders")}
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setAccountOpen(false);
                        logout();
                      }}
                      className="block w-full px-4 py-2 text-left text-sm hover:bg-kaboz-soft hover:text-kaboz-purple"
                    >
                      {t("logout")}
                    </button>
                  </div>
                ) : null}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="inline-flex items-center gap-1.5 rounded-full bg-kaboz-orange px-3.5 py-1.5 font-bold text-white transition hover:bg-kaboz-orange-dark"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden
                >
                  <circle cx="12" cy="8" r="3.5" />
                  <path d="M5 19.5c1.8-3.2 4.2-4.5 7-4.5s5.2 1.3 7 4.5" />
                </svg>
                {t("signIn")}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* —— 2. Logo + search (black mobile / white desktop) —— */}
      <div className="border-b border-white/10 bg-black md:border-kaboz-line md:bg-white">
        {/* Mobile */}
        <div className="kb-container flex items-center gap-2 py-2.5 md:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[6px] text-white"
            aria-label={t("openMenu")}
            aria-expanded={mobileOpen}
          >
            <span className="flex flex-col gap-1.5">
              <span className="block h-[2px] w-5 bg-current" />
              <span className="block h-[2px] w-5 bg-current" />
              <span className="block h-[2px] w-3.5 bg-current" />
            </span>
          </button>

          <Link to="/" className="flex min-w-0 flex-1 items-center justify-center">
            <img
              src={assets.logoOnDark}
              alt="Kaboz"
              className="h-9 w-auto max-w-[150px] object-contain"
            />
          </Link>

          <div className="flex flex-shrink-0 items-center">
            <NavIconBtn
              label={t("wishlist")}
              onClick={() => navigate("/wishlist")}
              badge={wishlistCount}
              className="text-white hover:text-kaboz-purple"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill={wishlistCount > 0 ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
              </svg>
            </NavIconBtn>
            <div className="relative" ref={mobileCartRef}>
              <NavIconBtn
                label={t("cart")}
                onClick={() => setCartPopupOpen((v) => !v)}
                badge={cartCount}
                className="text-white hover:text-kaboz-purple"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L21 8H6" />
                  <circle cx="10" cy="20" r="1" />
                  <circle cx="18" cy="20" r="1" />
                </svg>
              </NavIconBtn>
              {cartPopupOpen ? (
                <CartDropdown
                  items={cartPopupItems}
                  currency={currency}
                  delivery_fee={delivery_fee}
                  cartSubtotal={cartSubtotal}
                  cartTotal={cartTotal}
                  cartCount={cartCount}
                  updateQuantity={updateQuantity}
                  onClose={() => setCartPopupOpen(false)}
                  navigate={navigate}
                  t={t}
                />
              ) : null}
            </div>
          </div>
        </div>

        <div className="kb-container pb-3 md:hidden">
          <HeaderSearch variant="light" inputClassName="text-[13px]" />
        </div>

        {/* Desktop middle row */}
        <div className="kb-container hidden min-h-[100px] items-center gap-6 py-5 md:flex lg:min-h-[114px] lg:gap-10 lg:py-6">
          <Link to="/" className="flex-shrink-0">
            <img
              src={assets.logo}
              alt="Kaboz"
              className="h-11 w-auto lg:h-12"
            />
          </Link>

          <div className="mx-auto w-full max-w-[757px] flex-1">
            <HeaderSearch variant="light" />
          </div>

          <div className="hidden flex-shrink-0 items-center gap-3 lg:flex">
            <span
              className="flex h-12 w-12 items-center justify-center text-kaboz-orange"
              aria-hidden
            >
              <svg
                viewBox="0 0 24 24"
                className="h-9 w-9"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
              >
                <path d="M4 14v-1a8 8 0 0116 0v1" />
                <path d="M4 14a2 2 0 002 2h1v-5H6a2 2 0 00-2 2zM20 14a2 2 0 01-2 2h-1v-5h1a2 2 0 012 2z" />
                <path d="M9 19h6" />
              </svg>
            </span>
            <div className="text-[13px] leading-snug">
              <p className="text-kaboz-mute">
                {t("callUsNow")}{" "}
                <a
                  href="tel:+971552693100"
                  className="font-semibold text-kaboz-red hover:text-kaboz-red-dark"
                >
                  +971 55 269 3100
                </a>
              </p>
              <p className="mt-0.5 text-kaboz-mute">
                {t("email")}{" "}
                <a href="mailto:sales@kaboz.ae" className="kb-link !text-kaboz-orange hover:!text-kaboz-orange-dark">
                  sales@kaboz.ae
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* —— 3. Desktop nav (light bar) —— */}
      <div className="relative hidden border-b border-kaboz-line bg-[#eeeeee] md:block">
        <div className="kb-container flex h-[48px] items-center justify-between gap-4 lg:h-[52px]">
          <nav
            className="relative flex h-full flex-1 items-center gap-0.5 overflow-visible"
            aria-label="Primary"
            ref={catsRef}
            onMouseLeave={() => {
              if (window.matchMedia("(hover: hover)").matches) closeCats();
            }}
          >
            {MAIN_LINKS.map((link) => {
              if (link.mega) {
                return (
                  <div
                    key={link.to}
                    className="relative flex h-full items-center"
                    onMouseEnter={() => {
                      if (window.matchMedia("(hover: hover)").matches) {
                        setPageOpen(false);
                        setCatsOpen(true);
                        if (!activeCatId && navCategories[0]) {
                          setActiveCatId(navCategories[0]._id);
                        }
                      }
                    }}
                  >
                    <NavLink
                      to={link.to}
                      className={({ isActive }) =>
                        `flex h-full items-center px-3 text-[14px] font-semibold transition lg:px-3.5 lg:text-[15px] ${
                          isActive || catsOpen
                            ? "text-kaboz-purple"
                            : "text-kaboz-ink hover:text-kaboz-purple"
                        }`
                      }
                      onClick={() => {
                        if (!window.matchMedia("(hover: hover)").matches) {
                          setCatsOpen((v) => !v);
                          if (navCategories[0])
                            setActiveCatId(navCategories[0]._id);
                        }
                      }}
                    >
                      {t(link.labelKey)}
                    </NavLink>
                    {megaMenu}
                  </div>
                );
              }

              if (link.pageMenu) {
                const pageActive = link.children.some(
                  (c) =>
                    location.pathname === c.to ||
                    location.pathname.startsWith(`${c.to}/`)
                );
                return (
                  <div
                    key="page"
                    className="relative flex h-full items-center"
                    ref={pageRef}
                    onMouseEnter={() => {
                      if (window.matchMedia("(hover: hover)").matches) {
                        closeCats();
                        setPageOpen(true);
                      }
                    }}
                    onMouseLeave={() => {
                      if (window.matchMedia("(hover: hover)").matches) {
                        setPageOpen(false);
                      }
                    }}
                  >
                    <button
                      type="button"
                      className={`relative flex h-full items-center px-3 text-[14px] font-semibold transition lg:px-3.5 lg:text-[15px] ${
                        pageActive || pageOpen
                          ? "text-kaboz-purple after:absolute after:bottom-0 after:left-3 after:right-3 after:h-[2px] after:bg-kaboz-purple lg:after:left-3.5 lg:after:right-3.5"
                          : "text-kaboz-ink hover:text-kaboz-purple"
                      }`}
                      aria-expanded={pageOpen}
                      aria-haspopup="menu"
                      onClick={() => {
                        if (!window.matchMedia("(hover: hover)").matches) {
                          setPageOpen((v) => !v);
                        }
                      }}
                    >
                      {t(link.labelKey)}
                    </button>
                    {pageOpen ? (
                      <div
                        role="menu"
                        className="absolute left-0 top-full z-[220] min-w-[160px] overflow-hidden rounded-[4px] border border-kaboz-line bg-white shadow-mega mega-enter"
                      >
                        {link.children.map((child, i) => (
                          <NavLink
                            key={child.to}
                            to={child.to}
                            role="menuitem"
                            onClick={() => setPageOpen(false)}
                            className={({ isActive }) =>
                              `block px-4 py-2.5 text-[13px] transition ${
                                i > 0 ? "border-t border-kaboz-line" : ""
                              } ${
                                isActive
                                  ? "bg-kaboz-soft font-semibold text-kaboz-purple"
                                  : "text-kaboz-ink hover:bg-kaboz-soft hover:text-kaboz-purple"
                              }`
                            }
                          >
                            {t(child.labelKey)}
                          </NavLink>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              }

              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    `flex h-full items-center px-3 text-[14px] font-semibold transition lg:px-3.5 lg:text-[15px] ${
                      isActive
                        ? "text-kaboz-purple"
                        : "text-kaboz-ink hover:text-kaboz-purple"
                    }`
                  }
                >
                  {t(link.labelKey)}
                </NavLink>
              );
            })}
          </nav>

          <div className="relative flex flex-shrink-0 items-center gap-0.5" ref={desktopCartRef}>
            <NavIconBtn
              label={t("wishlist")}
              onClick={() => navigate("/wishlist")}
              badge={wishlistCount}
              showZeroBadge
            >
              <svg
                viewBox="0 0 24 24"
                className="h-[22px] w-[22px]"
                fill={wishlistCount > 0 ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
              </svg>
            </NavIconBtn>
            <NavIconBtn
              label={t("cart")}
              onClick={() => setCartPopupOpen((v) => !v)}
              badge={cartCount}
              showZeroBadge
            >
              <svg
                viewBox="0 0 24 24"
                className="h-[22px] w-[22px]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L21 8H6" />
                <circle cx="10" cy="20" r="1" />
                <circle cx="18" cy="20" r="1" />
              </svg>
            </NavIconBtn>
            {cartPopupOpen ? (
              <CartDropdown
                items={cartPopupItems}
                currency={currency}
                delivery_fee={delivery_fee}
                cartSubtotal={cartSubtotal}
                cartTotal={cartTotal}
                cartCount={cartCount}
                updateQuantity={updateQuantity}
                onClose={() => setCartPopupOpen(false)}
                navigate={navigate}
                t={t}
              />
            ) : null}
          </div>
        </div>
      </div>

      {/* —— Mobile canvas drawer (Onsus-style) —— */}
      <div
        className={`fixed inset-0 z-[9999] md:hidden transition ${
          mobileOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <button
          type="button"
          className="absolute inset-0 bg-black/50"
          aria-label="Close menu overlay"
          onClick={closeMobile}
        />
        <div
          className={`absolute left-0 top-0 flex h-full w-[min(320px,88vw)] flex-col bg-white shadow-2xl transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <div className="flex items-center justify-between border-b border-kaboz-line px-4 py-3">
            <Link to="/" onClick={closeMobile}>
              <img
                src={assets.logo}
                alt="Kaboz"
                className="h-8 w-auto max-w-[130px] object-contain"
              />
            </Link>
            <button
              type="button"
              onClick={closeMobile}
              className="flex h-9 w-9 items-center justify-center text-kaboz-ink"
              aria-label={t("closeMenu")}
            >
              <IconClose className="h-5 w-5" />
            </button>
          </div>

          <div className="flex border-b border-kaboz-line">
            {[
              ["menu", t("menu")],
              ["categories", t("categories")],
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setMobileTab(id)}
                className={`flex-1 py-3 text-sm font-bold uppercase tracking-wide ${
                  mobileTab === id
                    ? "border-b-2 border-kaboz-purple text-kaboz-purple"
                    : "text-kaboz-mute"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto">
            {mobileTab === "menu" ? (
              <div className="space-y-0.5 p-2">
                {MAIN_LINKS.flatMap((link) =>
                  link.pageMenu
                    ? link.children.map((child) => (
                        <NavLink
                          key={child.to}
                          to={child.to}
                          onClick={closeMobile}
                          className={({ isActive }) =>
                            `block rounded-[6px] px-4 py-3 text-sm font-semibold ${
                              isActive
                                ? "bg-kaboz-orange text-white"
                                : "text-kaboz-ink hover:bg-kaboz-soft"
                            }`
                          }
                        >
                          {t(child.labelKey)}
                        </NavLink>
                      ))
                    : [
                        <NavLink
                          key={link.to}
                          to={link.to}
                          end={link.to === "/"}
                          onClick={closeMobile}
                          className={({ isActive }) =>
                            `block rounded-[6px] px-4 py-3 text-sm font-semibold ${
                              isActive
                                ? "bg-kaboz-orange text-white"
                                : "text-kaboz-ink hover:bg-kaboz-soft"
                            }`
                          }
                        >
                          {t(link.labelKey)}
                        </NavLink>,
                      ]
                )}
                <NavLink
                  to="/wishlist"
                  onClick={closeMobile}
                  className={({ isActive }) =>
                    `block rounded-[6px] px-4 py-3 text-sm font-semibold ${
                      isActive
                        ? "bg-kaboz-red text-white"
                        : "text-kaboz-ink hover:bg-kaboz-soft"
                    }`
                  }
                >
                  {t("wishlist")}
                </NavLink>
              </div>
            ) : (
              <div>
                {isLoadingCategories ? (
                  <p className="px-4 py-4 text-xs text-kaboz-mute">Loading…</p>
                ) : (
                  mobileCategories.map((cat) => {
                    const hasSubs = cat.subcategories?.length > 0;
                    const isExpanded = expandedMobileCat === cat._id;
                    return (
                      <div
                        key={cat._id}
                        className="border-b border-kaboz-line/70"
                      >
                        <div className="flex items-center">
                          <Link
                            to={cat.href || getCategoryPath(cat.name)}
                            onClick={closeMobile}
                            className="flex-1 px-4 py-3 text-sm font-semibold text-kaboz-ink hover:text-kaboz-purple"
                          >
                            {getCategoryDisplayName(cat.name)}
                          </Link>
                          {hasSubs ? (
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedMobileCat((current) =>
                                  current === cat._id ? null : cat._id
                                )
                              }
                              className="flex h-11 w-11 flex-shrink-0 items-center justify-center text-kaboz-mute"
                              aria-expanded={isExpanded}
                              aria-label={
                                isExpanded
                                  ? "Collapse subcategories"
                                  : "Expand subcategories"
                              }
                            >
                              <IconChevronRight
                                className={`h-3.5 w-3.5 transition-transform ${
                                  isExpanded ? "rotate-90" : ""
                                }`}
                              />
                            </button>
                          ) : null}
                        </div>
                        {hasSubs && isExpanded ? (
                          <div className="bg-kaboz-soft/70 pb-2 pl-6 pr-4">
                            {cat.subcategories.map((sub) => (
                              <Link
                                key={sub.slug}
                                to={getCategoryPath(cat.filterName || cat.name, sub.slug)}
                                onClick={closeMobile}
                                className="block py-2 text-xs text-kaboz-mute hover:text-kaboz-purple"
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          <div className="flex-shrink-0 border-t border-kaboz-line p-4">
            {token ? (
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    closeMobile();
                    navigate("/orders");
                  }}
                  className="w-full rounded-[6px] bg-kaboz-orange py-3 text-center text-sm font-bold text-white"
                >
                  {t("orders")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    closeMobile();
                    logout();
                  }}
                  className="w-full rounded-[6px] border border-kaboz-line py-2.5 text-center text-sm font-semibold text-kaboz-ink"
                >
                  {t("logout")}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  closeMobile();
                  navigate("/login");
                }}
                className="w-full rounded-[6px] bg-kaboz-orange py-3 text-center text-sm font-bold text-white"
              >
                {t("signIn")}
              </button>
            )}
            <a
              href="tel:+971552693100"
              className="mt-3 block text-center text-xs font-semibold text-kaboz-mute hover:text-kaboz-purple"
            >
              Call +971 55 269 3100
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

const CartDropdown = ({
  items,
  currency,
  delivery_fee,
  cartSubtotal,
  cartTotal,
  cartCount,
  updateQuantity,
  onClose,
  navigate,
  t = (k) => k,
}) => (
  <div className="absolute right-0 top-full z-[200] mt-2 w-[min(340px,calc(100vw-1.25rem))] overflow-hidden rounded-[6px] border border-kaboz-line bg-white shadow-mega mega-enter">
    <div className="flex items-center justify-between border-b border-kaboz-line px-4 py-3">
      <p className="text-sm font-bold text-kaboz-ink">
        {t("cart")}
        {cartCount > 0 ? (
          <span className="ml-2 text-kaboz-purple">({cartCount})</span>
        ) : null}
      </p>
      <button
        type="button"
        onClick={onClose}
        className="text-lg leading-none text-kaboz-mute hover:text-kaboz-ink"
        aria-label={t("closeMenu")}
      >
        &times;
      </button>
    </div>

    {items.length === 0 ? (
      <div className="px-4 py-10 text-center">
        <p className="text-sm text-kaboz-mute">{t("emptyCart")}</p>
        <button
          type="button"
          onClick={() => {
            onClose();
            navigate("/collection");
          }}
          className="mt-3 text-sm font-semibold text-kaboz-purple hover:underline"
        >
          <span className="inline-flex items-center gap-1">
            {t("shop")}
            <IconArrowRight className="h-3.5 w-3.5" />
          </span>
        </button>
      </div>
    ) : (
      <>
        <div className="max-h-[260px] divide-y divide-kaboz-line overflow-y-auto bg-[#fafafa]">
          {items.map((item) => (
            <div key={item.lineKey} className="flex items-center gap-3 p-3.5">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-[6px] border border-kaboz-line bg-white">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-contain p-1"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-sm font-medium text-kaboz-ink">
                  {item.name}
                </p>
                {item.color ? (
                  <p className="mt-0.5 text-xs text-kaboz-purple">
                    Color: {item.color}
                  </p>
                ) : null}
                <p className="mt-0.5 text-xs text-kaboz-mute">
                  Qty {item.quantity}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <p className="text-sm font-bold text-kaboz-purple">
                  {currency}
                  {(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.lineKey, 0)}
                  className="text-xs text-kaboz-mute underline hover:text-kaboz-purple"
                >
                  {t("remove")}
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-2 border-t border-kaboz-line bg-white px-4 py-3.5 text-sm">
          <div className="flex justify-between text-kaboz-mute">
            <span>{t("subtotal")}</span>
            <span>
              {currency}
              {cartSubtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-kaboz-mute">
            <span>{t("shipping")}</span>
            <span>
              {currency}
              {delivery_fee.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between border-t border-kaboz-line pt-2 font-bold text-kaboz-ink">
            <span>{t("total")}</span>
            <span className="text-kaboz-purple">
              {currency}
              {cartTotal.toFixed(2)}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 border-t border-kaboz-line bg-white p-3">
          <button
            type="button"
            onClick={() => {
              onClose();
              navigate("/cart");
            }}
            className="rounded-[6px] border border-kaboz-ink bg-white py-2.5 text-xs font-bold uppercase tracking-wide text-kaboz-ink transition hover:bg-kaboz-soft"
          >
            {t("viewCart")}
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              navigate("/place-order");
            }}
            className="rounded-[6px] bg-kaboz-green py-2.5 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-kaboz-green-dark"
          >
            {t("checkout")}
          </button>
        </div>
      </>
    )}
  </div>
);

export default Navbar;
