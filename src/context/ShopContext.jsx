import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  makeCartLineKey,
  normalizeCartItems,
} from "../utils/cartLines";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "AED ";
  const delivery_fee = 0;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cartItems");
      return normalizeCartItems(savedCart ? JSON.parse(savedCart) : {});
    } catch {
      return {};
    }
  });

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const openCartDrawer = () => setCartDrawerOpen(true);
  const closeCartDrawer = () => setCartDrawerOpen(false);
  const navigate = useNavigate();

  /**
   * @param {string} itemId product _id
   * @param {{ color?: string, design?: string, colorImage?: string, quantity?: number, skipDrawer?: boolean }} options
   */
  const addToCart = async (itemId, options = {}) => {
    const {
      color = "",
      design = "",
      colorImage = "",
      quantity: addQty = 1,
      skipDrawer = false,
    } = options;

    const lineKey = makeCartLineKey(itemId, color);
    let cartData = structuredClone(cartItems);

    if (cartData[lineKey]) {
      cartData[lineKey].quantity += addQty;
      if (design) cartData[lineKey].design = design;
      if (colorImage) cartData[lineKey].colorImage = colorImage;
    } else {
      cartData[lineKey] = {
        productId: itemId,
        quantity: addQty,
        color: color || "",
        design: design || "",
        colorImage: colorImage || "",
      };
    }

    setCartItems(cartData);

    if (!skipDrawer) {
      setCartDrawerOpen(true);
    }

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/add",
          {
            itemId,
            color: color || "",
            design: design || "",
            colorImage: colorImage || "",
            quantity: addQty,
          },
          { headers: { token } },
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    const cart = normalizeCartItems(cartItems);

    for (const line of Object.values(cart)) {
      const productExists = products.some(
        (product) => product._id === line.productId,
      );
      if (productExists && line.quantity > 0) {
        totalCount += line.quantity;
      }
    }

    return totalCount;
  };

  /** @param {string} lineKey cart line key (productId::color) */
  const updateQuantity = async (lineKey, quantity) => {
    let cartData = structuredClone(normalizeCartItems(cartItems));

    if (quantity <= 0) {
      delete cartData[lineKey];
    } else if (cartData[lineKey]) {
      cartData[lineKey].quantity = quantity;
    }

    setCartItems(cartData);

    if (token) {
      try {
        const line = cartData[lineKey];
        await axios.post(
          backendUrl + "/api/cart/update",
          {
            itemId: line?.productId || lineKey.split("::")[0],
            color: line?.color || "",
            quantity,
          },
          { headers: { token } },
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    const cart = normalizeCartItems(cartItems);

    for (const line of Object.values(cart)) {
      const itemInfo = products.find(
        (product) => product._id === line.productId,
      );
      if (itemInfo) {
        totalAmount += itemInfo.price * line.quantity;
      }
    }

    return totalAmount;
  };

  const getProductsData = async () => {
    if (!backendUrl) {
      const message =
        "Backend URL is missing. Check frontend/.env.local (VITE_BACKEND_URL).";
      setProductsError(message);
      setProductsLoading(false);
      toast.error(message);
      return;
    }

    setProductsLoading(true);
    setProductsError("");

    try {
      const response = await axios.get(`${backendUrl}/api/product/list`, {
        timeout: 30000,
      });
      if (response.data.success) {
        setProducts(response.data.products || []);
      } else {
        const message = response.data.message || "Failed to load products";
        setProductsError(message);
        toast.error(message);
      }
    } catch (error) {
      console.log(error);
      const message =
        error.code === "ECONNABORTED"
          ? "Product catalog timed out. Is the backend running on port 4000?"
          : error.message || "Failed to load products";
      setProductsError(message);
      toast.error(message);
    } finally {
      setProductsLoading(false);
    }
  };

  const getUserCart = async (authToken) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/cart/get",
        {},
        { headers: { token: authToken } },
      );
      if (response.data.success) {
        setCartItems(normalizeCartItems(response.data.cartData || {}));
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getProductsData();
  }, [backendUrl]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
      getUserCart(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      getUserCart(token);
    }
  }, [token]);

  useEffect(() => {
    localStorage.setItem(
      "cartItems",
      JSON.stringify(normalizeCartItems(cartItems)),
    );
  }, [cartItems]);

  const value = {
    products,
    productsLoading,
    productsError,
    refreshProducts: getProductsData,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    setCartItems,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    token,
    setToken,
    user,
    setUser,
    cartDrawerOpen,
    setCartDrawerOpen,
    openCartDrawer,
    closeCartDrawer,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
