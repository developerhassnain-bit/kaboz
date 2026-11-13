/** Resolve admin-picked product IDs against the live catalog (preserve order). */
export const pickProductsByIds = (products = [], ids = [], limit = 12) => {
  if (!ids?.length) return [];
  const byId = Object.fromEntries(
    (products || []).map((p) => [String(p._id), p])
  );
  return ids
    .map((id) => byId[String(id)])
    .filter(Boolean)
    .slice(0, limit);
};

export const bannersBySlot = (homeBanners = []) =>
  Object.fromEntries(
    (homeBanners || [])
      .filter((b) => b?.slot && b.enabled !== false)
      .map((b) => [b.slot, b])
  );
