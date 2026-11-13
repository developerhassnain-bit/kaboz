import React, { useContext, useState } from "react";
import CartTotal from "../components/CartTotal";
import Breadcrumbs from "../components/Breadcrumbs";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { normalizeCartItems } from "../utils/cartLines";

const inputClass =
  "w-full rounded-[6px] border border-kaboz-line bg-white px-3.5 py-3 text-sm text-kaboz-ink outline-none transition placeholder:text-kaboz-mute focus:border-kaboz-orange";

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
  } = useContext(ShopContext);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      let orderItems = [];
      const normalizedCart = normalizeCartItems(cartItems);

      for (const line of Object.values(normalizedCart)) {
        if (line.quantity <= 0) continue;

        const itemInfo = structuredClone(
          products.find((product) => product._id === line.productId),
        );

        if (itemInfo) {
          itemInfo.quantity = line.quantity;
          itemInfo.selectedColor = line.color || "";
          itemInfo.selectedDesign = line.design || "";
          itemInfo.colorImage = line.colorImage || "";
          // Selected color code is the line SKU; else product SKU
          itemInfo.sku = line.color || itemInfo.sku || "";
          if (line.colorImage) {
            itemInfo.image = [line.colorImage, ...(itemInfo.image || [])];
          }
          orderItems.push(itemInfo);
        }
      }
      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      };
      switch (method) {
        case "cod": {
          const response = await axios.post(
            backendUrl + "/api/order/place",
            orderData,
            { headers: { token } },
          );

          if (response.data.success) {
            setCartItems({});
            navigate("/orders");
          } else {
            toast.error(response.data.message);
          }
          break;
        }
        case "stripe": {
          const responseStripe = await axios.post(
            backendUrl + "/api/order/stripe",
            orderData,
            { headers: { token } },
          );
          if (responseStripe.data.success) {
            const { session_url } = responseStripe.data;
            window.location.replace(session_url);
          } else {
            toast.error(responseStripe.data.message);
          }
          break;
        }
        default:
          break;
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const paymentOptions = [
    { id: "cod", label: "Cash on delivery (COD)" },
    { id: "stripe", label: "Pay with debit / credit card" },
  ];

  return (
    <form onSubmit={onSubmitHandler} className="pb-10">
      <Breadcrumbs
        items={[
          { label: "Home", to: "/" },
          { label: "Cart", to: "/cart" },
          { label: "Checkout" },
        ]}
      />

      <div className="mb-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-kaboz-orange">
          Checkout
        </p>
        <h1 className="font-display text-2xl font-bold text-kaboz-ink sm:text-3xl">
          Place your order
        </h1>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.35fr_0.9fr] lg:items-start lg:gap-6">
        {/* Delivery form */}
        <div className="rounded-[6px] border border-kaboz-line bg-white p-5 sm:p-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-kaboz-green">
            Shipping
          </p>
          <h2 className="mt-1 font-display text-xl font-bold text-kaboz-ink">
            Delivery information
          </h2>

          <div className="mt-5 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                required
                onChange={onChangeHandler}
                name="firstName"
                value={formData.firstName}
                className={inputClass}
                type="text"
                placeholder="First name"
              />
              <input
                required
                onChange={onChangeHandler}
                name="lastName"
                value={formData.lastName}
                className={inputClass}
                type="text"
                placeholder="Last name"
              />
            </div>
            <input
              required
              onChange={onChangeHandler}
              name="email"
              value={formData.email}
              className={inputClass}
              type="email"
              placeholder="Email address"
            />
            <input
              required
              onChange={onChangeHandler}
              name="street"
              value={formData.street}
              className={inputClass}
              type="text"
              placeholder="Street address"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                required
                onChange={onChangeHandler}
                name="city"
                value={formData.city}
                className={inputClass}
                type="text"
                placeholder="City"
              />
              <input
                required
                onChange={onChangeHandler}
                name="state"
                value={formData.state}
                className={inputClass}
                type="text"
                placeholder="State"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                required
                onChange={onChangeHandler}
                name="zipcode"
                value={formData.zipcode}
                className={inputClass}
                type="text"
                placeholder="Zipcode"
              />
              <input
                required
                onChange={onChangeHandler}
                name="country"
                value={formData.country}
                className={inputClass}
                type="text"
                placeholder="Country"
              />
            </div>
            <input
              required
              onChange={onChangeHandler}
              name="phone"
              value={formData.phone}
              className={inputClass}
              type="tel"
              placeholder="Phone"
            />
          </div>
        </div>

        {/* Summary + payment */}
        <div className="space-y-4">
          <div className="rounded-[6px] bg-kaboz-ink p-5 text-white sm:p-6">
            <CartTotal variant="dark" />
          </div>

          <div className="rounded-[6px] border border-kaboz-line bg-white p-5 sm:p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-kaboz-green">
              Payment
            </p>
            <h2 className="mt-1 font-display text-lg font-bold text-kaboz-ink">
              Payment method
            </h2>

            <div className="mt-4 space-y-2.5">
              {paymentOptions.map((opt) => {
                const active = method === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setMethod(opt.id)}
                    className={`flex w-full items-center gap-3 rounded-[6px] border px-3.5 py-3 text-left transition ${
                      active
                        ? "border-kaboz-orange bg-kaboz-orange-soft"
                        : "border-kaboz-line hover:border-kaboz-orange/50"
                    }`}
                  >
                    <span
                      className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                        active ? "border-kaboz-orange" : "border-[#ccc]"
                      }`}
                    >
                      {active ? (
                        <span className="h-2 w-2 rounded-full bg-kaboz-green" />
                      ) : null}
                    </span>
                    <span className="text-sm font-semibold text-kaboz-ink">
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="submit"
              className="mt-5 w-full rounded-[6px] bg-kaboz-green py-3.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-kaboz-green-dark"
            >
              Place order
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
