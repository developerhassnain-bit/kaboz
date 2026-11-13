/** Cart line key separator — productId::colorCode (or ::_ when no color) */
export const CART_NO_COLOR = "_";

export const makeCartLineKey = (productId, color = "") =>
  `${productId}::${color && String(color).trim() ? String(color).trim() : CART_NO_COLOR}`;

export const parseCartLineKey = (lineKey = "") => {
  const idx = String(lineKey).indexOf("::");
  if (idx === -1) {
    return { productId: lineKey, color: "" };
  }
  const productId = lineKey.slice(0, idx);
  const colorPart = lineKey.slice(idx + 2);
  return {
    productId,
    color: colorPart === CART_NO_COLOR ? "" : colorPart,
  };
};

/**
 * Normalize legacy `{ productId: number }` carts and newer line objects.
 */
export const normalizeCartItems = (raw = {}) => {
  const next = {};

  for (const [key, value] of Object.entries(raw || {})) {
    if (typeof value === "number") {
      if (value > 0) {
        const lineKey = key.includes("::") ? key : makeCartLineKey(key, "");
        const { productId, color } = parseCartLineKey(lineKey);
        next[lineKey] = {
          productId,
          quantity: value,
          color,
          design: "",
          colorImage: "",
        };
      }
      continue;
    }

    if (value && typeof value === "object") {
      const quantity = Number(value.quantity) || 0;
      if (quantity <= 0) continue;

      const productId = value.productId || parseCartLineKey(key).productId;
      const color = value.color || parseCartLineKey(key).color || "";
      const lineKey = makeCartLineKey(productId, color);

      next[lineKey] = {
        productId,
        quantity,
        color,
        design: value.design || "",
        colorImage: value.colorImage || "",
      };
    }
  }

  return next;
};
