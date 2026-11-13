import axios from "axios";

const VISITOR_KEY = "kabozVisitorId";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

/** Stable anonymous visitor id for recently-viewed sessions. */
export const getVisitorId = () => {
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `v_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return `v_${Date.now()}`;
  }
};

/** Tell backend this visitor just viewed a product. */
export const trackRecentlyViewed = async (productId) => {
  if (!productId || !backendUrl) return;
  try {
    await axios.post(`${backendUrl}/api/recently-viewed`, {
      sessionKey: getVisitorId(),
      productId: String(productId),
    });
  } catch {
    /* non-blocking */
  }
};

/**
 * Fetch products viewed in the last ~20 minutes (backend-enforced).
 * Returns up to 4 products.
 */
export const fetchRecentlyViewed = async ({ excludeId } = {}) => {
  if (!backendUrl) return [];
  try {
    const params = { sessionKey: getVisitorId() };
    if (excludeId) params.excludeId = String(excludeId);
    const { data } = await axios.get(`${backendUrl}/api/recently-viewed`, {
      params,
      headers: { "x-visitor-id": getVisitorId() },
    });
    if (data?.success && Array.isArray(data.products)) {
      return data.products;
    }
    return [];
  } catch {
    return [];
  }
};
