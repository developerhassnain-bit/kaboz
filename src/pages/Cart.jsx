import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import Breadcrumbs from "../components/Breadcrumbs";
import { makeCartLineKey, normalizeCartItems } from "../utils/cartLines";
import { IconArrowRight } from "../components/ui/Icons";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } =
    useContext(ShopContext);

  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const normalized = normalizeCartItems(cartItems);
      const tempData = Object.entries(normalized).map(([lineKey, line]) => ({
        lineKey,
        _id: line.productId,
        quantity: line.quantity,
        color: line.color || "",
        design: line.design || "",
        colorImage: line.colorImage || "",
      }));
      setCartData(tempData);
    }
  }, [cartItems, products]);

  return (
    <div className="pb-10">
      <Helmet>
        <title>Cart | Kaboz</title>
      </Helmet>

      <Breadcrumbs
        items={[{ label: "Home", to: "/" }, { label: "Cart" }]}
      />

      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-kaboz-orange">
            Shopping bag
          </p>
          <h1 className="font-display text-2xl font-bold text-kaboz-ink sm:text-3xl">
            Your cart
          </h1>
        </div>
        <Link
          to="/collection"
          className="inline-flex items-center gap-1 text-sm font-semibold text-kaboz-mute hover:text-kaboz-orange"
        >
          Continue shopping
          <IconArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {cartData.length === 0 ? (
        <div className="rounded-[6px] border border-dashed border-kaboz-line bg-kaboz-soft px-6 py-16 text-center">
          <p className="font-display text-lg font-semibold text-kaboz-ink">
            Your cart is empty
          </p>
          <p className="mt-1 text-sm text-kaboz-mute">
            Browse products and add items to get started.
          </p>
          <button
            type="button"
            onClick={() => navigate("/collection")}
            className="mt-5 rounded-[6px] bg-kaboz-orange px-5 py-2.5 text-sm font-bold text-white hover:bg-kaboz-orange-dark"
          >
            Shop now
          </button>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.75fr] lg:items-start">
          <div className="overflow-hidden rounded-[6px] border border-kaboz-line bg-white">
            {cartData.map((item, index) => {
              const productData = products.find(
                (product) => product._id === item._id
              );
              if (!productData) return null;

              const thumb = item.colorImage || productData.image?.[0] || "";

              return (
                <div
                  key={item.lineKey || makeCartLineKey(item._id, item.color)}
                  className={`grid grid-cols-[1fr_auto] items-center gap-4 p-4 sm:grid-cols-[1fr_auto_auto] sm:gap-6 sm:p-5 ${
                    index > 0 ? "border-t border-kaboz-line" : ""
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-[6px] border border-kaboz-line bg-[#fafafa] sm:h-24 sm:w-24">
                      <img
                        className="h-full w-full object-contain p-2"
                        src={thumb}
                        alt={productData.name}
                      />
                    </div>
                    <div className="min-w-0">
                      <Link
                        to={`/product/${productData.slug}`}
                        className="line-clamp-2 text-sm font-semibold text-kaboz-ink transition hover:text-kaboz-purple sm:text-base"
                      >
                        {productData.name}
                      </Link>
                      {item.design ? (
                        <p className="mt-1 text-xs text-kaboz-mute">
                          Design:{" "}
                          <span className="font-semibold text-kaboz-ink">
                            {item.design}
                          </span>
                        </p>
                      ) : null}
                      {item.color ? (
                        <p className="mt-0.5 text-xs text-kaboz-mute">
                          Color:{" "}
                          <span className="font-semibold text-kaboz-orange">
                            {item.color}
                          </span>
                        </p>
                      ) : null}
                      {(item.color || productData.sku) && (
                        <p className="mt-0.5 text-xs text-kaboz-mute">
                          SKU:{" "}
                          <span className="font-semibold text-kaboz-ink">
                            {item.color || productData.sku}
                          </span>
                        </p>
                      )}
                      <p className="mt-1 text-sm font-bold text-kaboz-price">
                        {currency}
                        {productData.price}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center overflow-hidden rounded-[6px] border border-kaboz-line bg-white">
                    <button
                      type="button"
                      onClick={() => {
                        if (item.quantity > 1) {
                          updateQuantity(item.lineKey, item.quantity - 1);
                        }
                      }}
                      disabled={item.quantity <= 1}
                      className="flex h-9 w-9 items-center justify-center text-lg text-kaboz-ink hover:bg-kaboz-soft disabled:cursor-not-allowed disabled:opacity-30"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="flex h-9 min-w-9 items-center justify-center border-x border-kaboz-line text-sm font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.lineKey, item.quantity + 1)
                      }
                      className="flex h-9 w-9 items-center justify-center text-lg text-kaboz-ink hover:bg-kaboz-soft"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => updateQuantity(item.lineKey, 0)}
                    className="justify-self-end rounded-[6px] p-2 hover:bg-kaboz-soft"
                    aria-label="Remove item"
                  >
                    <img
                      className="h-5 w-5 opacity-60"
                      src={assets.bin_icon}
                      alt=""
                    />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="rounded-[6px] bg-kaboz-ink p-5 text-white sm:p-6">
            <CartTotal />
            <button
              type="button"
              onClick={() => navigate("/place-order")}
              className="mt-6 w-full rounded-[6px] bg-kaboz-green py-3.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-kaboz-green-dark"
            >
              Proceed to checkout
            </button>
            <button
              type="button"
              onClick={() => navigate("/collection")}
              className="mt-3 w-full rounded-[6px] border border-white/20 py-3 text-sm font-semibold text-white/80 transition hover:border-kaboz-gold hover:text-kaboz-gold"
            >
              Continue shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
