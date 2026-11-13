export const WISHLIST_KEY = "kabozWishlist";
export const WISHLIST_EVENT = "kaboz-wishlist-change";

export const readWishlistIds = () => {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
};

export const writeWishlistIds = (ids) => {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event(WISHLIST_EVENT));
};

export const isInWishlist = (productId) =>
  readWishlistIds().includes(productId);

export const toggleWishlistId = (productId) => {
  const list = readWishlistIds();
  const exists = list.includes(productId);
  const next = exists
    ? list.filter((id) => id !== productId)
    : [...list, productId];
  writeWishlistIds(next);
  return { added: !exists, ids: next };
};

export const removeFromWishlist = (productId) => {
  writeWishlistIds(readWishlistIds().filter((id) => id !== productId));
};

export const getWishlistCount = () => readWishlistIds().length;
