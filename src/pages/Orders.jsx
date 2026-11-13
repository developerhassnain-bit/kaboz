import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import Breadcrumbs from "../components/Breadcrumbs";
import axios from "axios";

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrderData = async () => {
    try {
      if (!token) {
        setLoading(false);
        return null;
      }

      const response = await axios.post(
        backendUrl + "/api/order/userorders",
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        const allOrdersItem = [];

        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            allOrdersItem.push({
              ...item,
              status: order.status,
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.date,
            });
          });
        });

        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) {
      console.log("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  return (
    <div className="pb-10">
      <Helmet>
        <title>My Orders | Kaboz</title>
      </Helmet>

      <Breadcrumbs
        items={[{ label: "Home", to: "/" }, { label: "My orders" }]}
      />

      <header className="relative mb-8 overflow-hidden rounded-[6px] bg-kaboz-ink px-5 py-8 text-white sm:mb-10 sm:px-8 sm:py-10">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 18% 40%, #f15a24 0%, transparent 42%), radial-gradient(circle at 88% 20%, #fff 0%, transparent 35%)",
          }}
        />
        <div className="relative">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-kaboz-orange">
            Account
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
            My orders
          </h1>
          <p className="mt-2 text-sm text-white/65">
            View your recent purchases and order status.
          </p>
        </div>
      </header>

      {!token ? (
        <div className="rounded-[6px] border border-dashed border-kaboz-line bg-kaboz-soft px-6 py-14 text-center">
          <p className="font-display text-lg font-bold text-kaboz-ink">
            Sign in to view orders
          </p>
          <p className="mt-1 text-sm text-kaboz-mute">
            Your order history appears here after you log in.
          </p>
          <Link
            to="/login"
            className="mt-5 inline-flex rounded-[6px] bg-kaboz-orange px-5 py-2.5 text-sm font-bold text-white hover:bg-kaboz-orange-dark"
          >
            Sign in
          </Link>
        </div>
      ) : loading ? (
        <div className="flex justify-center py-16">
          <span className="inline-block h-7 w-7 animate-spin rounded-full border-2 border-kaboz-line border-t-kaboz-orange" />
        </div>
      ) : orderData.length > 0 ? (
        <div className="space-y-3">
          {orderData.map((item, index) => (
            <div
              key={`${item._id || item.name}-${index}`}
              className="flex flex-col gap-4 rounded-[6px] border border-kaboz-line bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
            >
              <div className="flex items-start gap-4 sm:gap-5">
                <img
                  className="h-20 w-20 rounded-[6px] border border-kaboz-line object-cover sm:h-24 sm:w-24"
                  src={item.image?.[0]}
                  alt={item.name}
                />
                <div>
                  <p className="font-display text-base font-bold text-kaboz-ink sm:text-lg">
                    {item.name}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-kaboz-ink">
                    <p className="font-semibold">
                      {currency}
                      {item.price}
                    </p>
                    <p className="text-kaboz-mute">Qty: {item.quantity}</p>
                    {(item.sku || item.selectedColor) && (
                      <p className="text-kaboz-mute">
                        SKU:{" "}
                        <span className="font-semibold text-kaboz-ink">
                          {item.sku || item.selectedColor}
                        </span>
                      </p>
                    )}
                    {item.selectedColor ? (
                      <p className="text-kaboz-mute">
                        Color:{" "}
                        <span className="font-semibold text-kaboz-green">
                          {item.selectedColor}
                        </span>
                      </p>
                    ) : null}
                    {item.selectedDesign ? (
                      <p className="text-kaboz-mute">
                        Design:{" "}
                        <span className="font-semibold text-kaboz-ink">
                          {item.selectedDesign}
                        </span>
                      </p>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm text-kaboz-mute">
                    Date:{" "}
                    <span className="text-kaboz-ink">
                      {new Date(item.date).toDateString()}
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-kaboz-mute">
                    Payment:{" "}
                    <span className="font-medium text-kaboz-ink">
                      {item.paymentMethod}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start rounded-[6px] bg-kaboz-green-soft px-3.5 py-2 sm:self-center">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <p className="text-sm font-semibold text-kaboz-ink">
                  {item.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-[6px] border border-dashed border-kaboz-line bg-kaboz-soft px-6 py-16 text-center">
          <p className="font-display text-xl font-bold text-kaboz-ink">
            No orders yet
          </p>
          <p className="mt-2 text-base text-kaboz-mute">
            When you place an order, it will show up here.
          </p>
          <Link
            to="/collection"
            className="mt-5 inline-flex rounded-[6px] bg-kaboz-orange px-5 py-2.5 text-sm font-bold text-white hover:bg-kaboz-orange-dark"
          >
            Browse products
          </Link>
        </div>
      )}
    </div>
  );
};

export default Orders;
