import React, { useContext, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { normalizeCartItems } from "../utils/cartLines";

const FREE_SHIPPING_THRESHOLD = 200;

const CartDrawer = () => {
  const {
    cartDrawerOpen,
    closeCartDrawer,
    cartItems,
    products,
    currency,
    updateQuantity,
  } = useContext(ShopContext);

  const navigate = useNavigate();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && cartDrawerOpen) {
        closeCartDrawer();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cartDrawerOpen, closeCartDrawer]);

  // Lock body scroll when open
  useEffect(() => {
    if (cartDrawerOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [cartDrawerOpen]);

  // Calculate items in drawer
  const drawerItems = useMemo(() => {
    const normalized = normalizeCartItems(cartItems);
    return Object.entries(normalized)
      .map(([lineKey, line]) => {
        const product = products.find((p) => p._id === line.productId);
        if (!product) return null;
        return {
          lineKey,
          productId: line.productId,
          name: product.name,
          slug: product.slug || product._id,
          price: product.price,
          quantity: line.quantity,
          color: line.color,
          design: line.design,
          image: line.colorImage || product.image?.[0] || "",
        };
      })
      .filter((item) => item && item.quantity > 0);
  }, [cartItems, products]);

  const subtotal = useMemo(() => {
    return drawerItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }, [drawerItems]);

  const progress = Math.min(
    100,
    Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  );
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[200] bg-black/50 backdrop-blur-[1px] transition-opacity duration-300 ${
          cartDrawerOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={closeCartDrawer}
        aria-hidden="true"
      />

      {/* Slide-out Drawer */}
      <aside
        role="dialog"
        aria-label="Shop Cart"
        aria-modal="true"
        className={`fixed inset-y-0 right-0 z-[210] flex w-full max-w-[400px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          cartDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-lg font-bold text-gray-900">
            Shop Cart
            {drawerItems.length > 0 ? (
              <span className="ml-2 text-xs font-normal text-gray-500">
                ({drawerItems.length}{" "}
                {drawerItems.length === 1 ? "item" : "items"})
              </span>
            ) : null}
          </h2>
          <button
            type="button"
            onClick={closeCartDrawer}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close cart drawer"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body / Scrollable items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {drawerItems.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 text-gray-400">
                <svg
                  className="h-8 w-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                >
                  <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L21 8H6" />
                  <circle cx="10" cy="20" r="1" />
                  <circle cx="18" cy="20" r="1" />
                </svg>
              </div>
              <p className="text-base font-semibold text-gray-800">
                Your cart is empty
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Looks like you haven't added anything to your cart yet.
              </p>
              <button
                type="button"
                onClick={() => {
                  closeCartDrawer();
                  navigate("/collection");
                }}
                className="mt-5 rounded-[6px] bg-kaboz-orange px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-kaboz-orange-dark"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {drawerItems.map((item) => (
                <div key={item.lineKey} className="flex gap-3 py-4 first:pt-0 last:pb-0">
                  {/* Thumbnail */}
                  <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded border border-gray-100 bg-[#f9fafb] p-1">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-100" />
                    )}
                  </div>

                  {/* Details */}
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/product/${item.slug}`}
                      onClick={closeCartDrawer}
                      className="line-clamp-2 text-sm font-semibold text-[#1a56db] hover:underline"
                    >
                      {item.name}
                    </Link>

                    {item.color || item.design ? (
                      <p className="mt-0.5 text-xs text-gray-500">
                        {item.design ? <span>{item.design}</span> : null}
                        {item.design && item.color ? " · " : ""}
                        {item.color ? <span>Color: {item.color}</span> : null}
                      </p>
                    ) : null}

                    <p className="mt-1 text-sm font-bold text-gray-900">
                      {currency}
                      {item.price.toFixed(2)}
                    </p>

                    {/* Quantity Stepper & Multiplier */}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="inline-flex items-center overflow-hidden rounded border border-gray-200">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.lineKey, item.quantity - 1)
                          }
                          className="flex h-6 w-6 items-center justify-center text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="flex h-6 min-w-[28px] items-center justify-center border-x border-gray-200 px-1 text-xs font-semibold text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.lineKey, item.quantity + 1)
                          }
                          className="flex h-6 w-6 items-center justify-center text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-xs text-gray-400">
                        × {item.quantity}
                      </span>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <div className="shrink-0 pl-1">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.lineKey, 0)}
                      className="p-1 text-gray-400 transition hover:text-red-500"
                      aria-label={`Remove ${item.name}`}
                      title="Remove"
                    >
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer (only when items exist) */}
        {drawerItems.length > 0 ? (
          <div className="border-t border-gray-100 bg-white px-5 py-4 space-y-3.5">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-800">
                Subtotal:
              </span>
              <span className="text-lg font-bold text-kaboz-orange">
                {currency}
                {subtotal.toFixed(2)}
              </span>
            </div>

            {/* Dual Action Buttons */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  closeCartDrawer();
                  navigate("/cart");
                }}
                className="rounded-[6px] bg-[#333f48] py-3 text-center text-xs sm:text-sm font-bold text-white transition hover:bg-[#232b31]"
              >
                View cart
              </button>
              <button
                type="button"
                onClick={() => {
                  closeCartDrawer();
                  navigate("/place-order");
                }}
                className="rounded-[6px] bg-kaboz-orange py-3 text-center text-xs sm:text-sm font-bold text-white transition hover:bg-kaboz-orange-dark"
              >
                Checkout
              </button>
            </div>

            {/* Free Shipping Progress & Note */}
            <div className="pt-1 border-t border-gray-100">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full bg-kaboz-orange transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-2.5 flex items-center gap-2 text-xs text-gray-600">
                <svg
                  className="h-4 w-4 shrink-0 text-gray-700"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M1 3h14v11H1z" />
                  <path d="M15 7h4l3 3v4h-7V7z" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="17.5" cy="18.5" r="2.5" />
                </svg>
                <span>
                  {remaining === 0 ? (
                    <span className="font-semibold text-emerald-600">
                      You qualify for free shipping!
                    </span>
                  ) : (
                    <>
                      Get free shipping for orders over{" "}
                      <strong className="text-gray-900">
                        {currency}
                        {FREE_SHIPPING_THRESHOLD}
                      </strong>
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </aside>
    </>
  );
};

export default CartDrawer;