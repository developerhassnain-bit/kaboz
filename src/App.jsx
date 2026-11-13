import React, { useContext, useEffect, useMemo } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import PlaceOrder from "./pages/PlaceOrder";
import Orders from "./pages/Orders";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LivingLayout from "./components/living/LivingLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CurtainsLanding from "./pages/CurtainsLanding";
import BedsheetsLanding from "./pages/BedsheetsLanding";
import LuxuryBedsheetsLanding from "./pages/LuxuryBedsheetsLanding";
import CurtainsShopLanding from "./pages/CurtainsShopLanding";
import UpholsteryLanding from "./pages/UpholsteryLanding";
import Verify from "./pages/Verify";
import WhatsAppButton from "./components/WhatsAppButton";
import MobileBottomNav from "./components/MobileBottomNav";
import Services from "./pages/Services";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Wishlist from "./pages/Wishlist";
import { ShopContext } from "./context/ShopContext";
import { isLivingCategory, LIVING_CATEGORY_SET } from "./utils/categoryLinks";

const LIVING_PATHS = new Set([
  "/living",
  "/curtains",
  "/bedsheets",
  "/luxury-bedsheets",
  "/upholstery",
]);

const StorePage = ({ children }) => (
  <div className="kb-container bg-white py-4 sm:py-6">{children}</div>
);

/** Living shop pages + living PDPs share Living navbar/footer */
const LivingStorePage = ({ children }) => (
  <LivingLayout contained>{children}</LivingLayout>
);

/** Living product detection — pending while catalog loads (avoids main-store chrome flash) */
const useLivingProductState = () => {
  const { pathname } = useLocation();
  const { products, productsLoading } = useContext(ShopContext);

  return useMemo(() => {
    if (!pathname.startsWith("/product/")) {
      return { isLiving: false, pending: false };
    }
    const slug = decodeURIComponent(pathname.replace(/^\/product\//, ""));
    if (!slug) return { isLiving: false, pending: false };

    const product = products.find(
      (p) => p.slug === slug || String(p._id) === slug
    );
    if (product) {
      return { isLiving: isLivingCategory(product.category), pending: false };
    }
    // Catalog still loading — keep main Navbar/Footer off until we know
    if (productsLoading) {
      return { isLiving: false, pending: true };
    }
    return { isLiving: false, pending: false };
  }, [pathname, products, productsLoading]);
};

const useIsLivingCollectionRoute = () => {
  const { pathname, search } = useLocation();
  return useMemo(() => {
    if (pathname !== "/collection") return false;
    const category = new URLSearchParams(search).get("category") || "";
    return LIVING_CATEGORY_SET.has(category);
  }, [pathname, search]);
};

/** Product route that picks Living vs main store chrome once category is known */
const ProductRoute = () => {
  const { isLiving, pending } = useLivingProductState();

  if (pending) {
    return (
      <div className="kb-container bg-[#faf8f5] py-20 text-center text-sm text-kaboz-mute">
        Loading product…
      </div>
    );
  }

  if (isLiving) {
    return (
      <LivingStorePage>
        <Product />
      </LivingStorePage>
    );
  }

  return (
    <StorePage>
      <Product />
    </StorePage>
  );
};

const CollectionRoute = () => {
  const living = useIsLivingCollectionRoute();
  if (living) {
    return (
      <LivingStorePage>
        <Collection />
      </LivingStorePage>
    );
  }
  return (
    <StorePage>
      <Collection />
    </StorePage>
  );
};

const App = () => {
  const { pathname, hash } = useLocation();
  const isLoginPage = pathname === "/login";

  // Reset scroll on route change so footer links open the new page at the top
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);
  const isLivingShopPath = LIVING_PATHS.has(pathname);
  const { isLiving: isLivingProduct, pending: livingProductPending } =
    useLivingProductState();
  const isLivingCollection = useIsLivingCollectionRoute();

  /** Main Onsus chrome is hidden for the entire Living microsite */
  const useLivingChrome =
    isLivingShopPath ||
    isLivingProduct ||
    isLivingCollection ||
    livingProductPending;

  return (
    <div className="flex min-h-screen flex-col bg-white text-kaboz-ink">
      <ToastContainer />
      {!isLoginPage && !useLivingChrome && <Navbar />}
      <main className="w-full flex-1 bg-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<CollectionRoute />} />
          <Route path="/about" element={<StorePage><About /></StorePage>} />
          <Route path="/faq" element={<StorePage><FAQ /></StorePage>} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product/:slug" element={<ProductRoute />} />
          {/* Living hub has its own full-bleed layout (includes Living chrome) */}
          <Route path="/living" element={<CurtainsLanding />} />
          <Route
            path="/bedsheets"
            element={
              <LivingStorePage>
                <BedsheetsLanding />
              </LivingStorePage>
            }
          />
          <Route
            path="/luxury-bedsheets"
            element={
              <LivingStorePage>
                <LuxuryBedsheetsLanding />
              </LivingStorePage>
            }
          />
          <Route
            path="/curtains"
            element={
              <LivingStorePage>
                <CurtainsShopLanding />
              </LivingStorePage>
            }
          />
          <Route
            path="/upholstery"
            element={
              <LivingStorePage>
                <UpholsteryLanding />
              </LivingStorePage>
            }
          />
          <Route path="/cart" element={<StorePage><Cart /></StorePage>} />
          <Route path="/wishlist" element={<StorePage><Wishlist /></StorePage>} />
          <Route path="/login" element={<Login />} />
          <Route path="/place-order" element={<StorePage><PlaceOrder /></StorePage>} />
          <Route path="/orders" element={<StorePage><Orders /></StorePage>} />
          <Route path="/verify" element={<StorePage><Verify /></StorePage>} />
          <Route path="/services" element={<StorePage><Services /></StorePage>} />
          <Route path="/blog" element={<StorePage><Blog /></StorePage>} />
          <Route path="/blog/:slug" element={<StorePage><BlogPost /></StorePage>} />
        </Routes>
      </main>
      {!isLoginPage && !useLivingChrome && <Footer />}
      {!useLivingChrome && <MobileBottomNav />}
      <WhatsAppButton />
    </div>
  );
};

export default App;
