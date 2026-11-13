import React, { useContext, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import Breadcrumbs from "../components/Breadcrumbs";
import ProductItem from "../components/ProductItem";
import {
  readWishlistIds,
  removeFromWishlist,
  WISHLIST_EVENT,
} from "../utils/wishlist";

const Wishlist = () => {
  const { products } = useContext(ShopContext);
  const [ids, setIds] = useState(() => readWishlistIds());

  useEffect(() => {
    window.scrollTo(0, 0);
    const sync = () => setIds(readWishlistIds());
    window.addEventListener(WISHLIST_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(WISHLIST_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const wishlistProducts = useMemo(() => {
    const idSet = new Set(ids);
    return products.filter((p) => idSet.has(p._id));
  }, [products, ids]);

  const clearAll = () => {
    ids.forEach((id) => removeFromWishlist(id));
    setIds([]);
  };

  return (
    <div className="pb-6">
      <Helmet>
        <title>Wishlist | Kaboz</title>
        <meta
          name="description"
          content="Your saved Kaboz wishlist products."
        />
      </Helmet>

      <Breadcrumbs
        items={[{ label: "Home", to: "/" }, { label: "Wishlist" }]}
      />

      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-kaboz-red">
            Saved items
          </p>
          <h1 className="font-display text-2xl font-bold text-kaboz-ink sm:text-3xl">
            Wishlist
          </h1>
          <p className="mt-1 text-sm text-kaboz-mute">
            {wishlistProducts.length}{" "}
            {wishlistProducts.length === 1 ? "product" : "products"} saved
          </p>
        </div>
        {wishlistProducts.length > 0 ? (
          <button
            type="button"
            onClick={clearAll}
            className="text-sm font-semibold text-kaboz-mute hover:text-kaboz-orange"
          >
            Clear wishlist
          </button>
        ) : null}
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="rounded-[6px] border border-dashed border-kaboz-line bg-kaboz-soft px-6 py-16 text-center">
          <p className="font-display text-lg font-semibold text-kaboz-ink">
            Your wishlist is empty
          </p>
          <p className="mt-1 text-sm text-kaboz-mute">
            Hover a product and tap the heart to save it here.
          </p>
          <Link
            to="/collection"
            className="mt-5 inline-flex rounded-[6px] bg-kaboz-orange px-5 py-2.5 text-sm font-bold text-white hover:bg-kaboz-orange-dark"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-7 md:grid-cols-4 lg:grid-cols-5 xl:gap-x-5">
          {wishlistProducts.map((item) => (
            <ProductItem
              key={item._id}
              id={item._id}
              slug={item.slug}
              image={item.image}
              name={item.name}
              price={item.price}
              originalPrice={item.originalPrice}
              date={item.date}
              curtainTypes={item.curtainTypes}
              category={item.category}
              subCategory={item.subCategory}
              sku={item.sku}
              brand={item.brand}
              modelName={item.modelName}
              reviews={item.reviews}
              variant="light"
              compact
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
