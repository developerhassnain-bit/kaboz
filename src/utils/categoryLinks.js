/** Friendly labels for nav / UI (DB category names stay unchanged). */
const CATEGORY_DISPLAY_NAMES = {
  CCTV: "CCTV Cameras",
  Curtains: "Kaboz Living",
  "Security Cameras": "CCTV Cameras",
};

/** Cameras before Recorders (client Home Menu rule for CCTV). */
export const cameraRecorderRank = (subName = "") => {
  if (/camera/i.test(subName)) return 0;
  if (/recorder|nvr|dvr/i.test(subName)) return 1;
  return 2;
};

export const sortCameraRecorderSubs = (subs = []) =>
  [...subs].sort(
    (a, b) =>
      cameraRecorderRank(a?.name || a) - cameraRecorderRank(b?.name || b)
  );

/** Living catalog categories — never mixed into Security destinations. */
export const LIVING_CATEGORY_NAMES = [
  "Curtains",
  "Bedsheets",
  "Luxury Bedsheets",
  "Upholstery",
];

export const LIVING_CATEGORY_SET = new Set(LIVING_CATEGORY_NAMES);

/** Primary Security brand category (DB name). */
export const SECURITY_CATEGORY_NAME = "Security Cameras";

/** Related security/hardware categories shown beside Kaboz Security. */
export const SECURITY_RELATED_CATEGORIES = [
  "Security Cameras",
  "Access Control",
  "Video Intercom",
  "Network Switches",
  "Kits",
  "Software License",
  "Accessories",
];

/** Hidden from the horizontal menu bar (still available in Menu mega / drawer). */
const HIDDEN_FROM_TOP_NAV = new Set([
  "Curtains",
  "Luxury Bedsheets",
  "Bedsheets",
  "Upholstery",
]);

/** Preferred order: CCTV Cameras first, followed by client specified sequence. */
const TOP_NAV_PRIORITY = [
  "Security Cameras",
  "Access Control",
  "Video Intercom",
  "Network Switches",
  "Kits",
  "Software License",
  "Accessories",
  "Curtains",
  "Bedsheets",
  "Luxury Bedsheets",
  "Upholstery",
];

/**
 * Named landing / hub paths.
 * Kaboz Living brand hub is `/living` (not `/curtains`).
 * Curtains/Bedsheets/etc. keep their dedicated shop paths.
 * Kaboz Security has no separate path — uses collection query.
 */
const CATEGORY_HUB_PATHS = {
  Curtains: "/living",
  Upholstery: "/upholstery",
  Bedsheets: "/bedsheets",
  "Luxury Bedsheets": "/luxury-bedsheets",
};

/** Dedicated Living product-shop paths (not the brand hub). */
export const LIVING_SHOP_PATHS = {
  Curtains: "/curtains",
  Upholstery: "/upholstery",
  Bedsheets: "/bedsheets",
  "Luxury Bedsheets": "/luxury-bedsheets",
};

export const getCategoryDisplayName = (categoryName) =>
  CATEGORY_DISPLAY_NAMES[categoryName] || categoryName;

export const isLivingCategory = (categoryName) =>
  LIVING_CATEGORY_SET.has(categoryName);

export const isSecurityCategory = (categoryName) =>
  categoryName === SECURITY_CATEGORY_NAME;

/** Kaboz Living brand hub URL */
export const LIVING_HUB_PATH = "/living";

/** Kaboz Security destination URL (existing collection filter — do not change). */
export const SECURITY_HUB_PATH = `/collection?category=${encodeURIComponent(
  SECURITY_CATEGORY_NAME
)}`;

/** Kaboz Living → Kaboz Security, then remaining categories. */
export const orderNavCategories = (categories = []) => {
  const byName = Object.fromEntries(categories.map((c) => [c.name, c]));
  const prioritized = TOP_NAV_PRIORITY.map((name) => byName[name]).filter(
    Boolean
  );
  const rest = categories.filter((c) => !TOP_NAV_PRIORITY.includes(c.name));
  return [...prioritized, ...rest];
};

/** Drop bedding/upholstery duplicates — Kaboz Living covers them. */
export const withoutLivingDuplicates = (categories = []) =>
  categories.filter((c) => !HIDDEN_FROM_TOP_NAV.has(c.name));

/** Horizontal menu bar items (no separate Curtains/Bedding duplicates). */
export const getTopNavCategories = (categories = [], limit = 8) =>
  withoutLivingDuplicates(orderNavCategories(categories)).slice(0, limit);

/** Client-approved menu order (labels are the display names). */
const DEPARTMENT_ORDER = [
  "CCTV",
  "Security Cameras",
  "Access Control",
  "Video Intercom",
  "Network Switches",
  "Kits",
  "Software License",
  "Accessories",
];

const subRank = (sub, patterns) => {
  const i = patterns.findIndex((re) => re.test(sub?.name || ""));
  return i === -1 ? patterns.length : i;
};

const sortSubs = (subs = [], patterns) =>
  [...subs].sort((a, b) => subRank(a, patterns) - subRank(b, patterns));

/**
 * Department list shown on desktop (hero + menu) and mobile (search dropdown
 * + drawer), in the client's order. "CCTV" (labelled "CCTV Cameras") is the
 * Security category: only Cameras then Recorders. Access Control lists
 * Devices before Controllers. `filterName` is the real DB category name.
 */
const KIT_SUB_ORDER = [/cctv/i, /intercom/i, /access\s*control/i];

export const getDepartmentCategories = (categories = []) => {
  const security = categories.find((c) => c.name === SECURITY_CATEGORY_NAME);
  const camRec = [/camera/i, /recorder|nvr|dvr/i];
  const secSubs = (security?.subcategories || []).filter((s) =>
    camRec.some((re) => re.test(s.name || ""))
  );

  // Exclude Security Cameras and CCTV from the raw map because we add the unified CCTV entry
  const list = withoutLivingDuplicates(orderNavCategories(categories))
    .filter((c) => c.name !== SECURITY_CATEGORY_NAME && c.name !== "CCTV")
    .map((c) => {
      if (c.name === "Access Control") {
        return {
          ...c,
          subcategories: sortSubs(c.subcategories, [
            /device/i,
            /controller/i,
          ]),
        };
      }
      if (c.name === "Kits") {
        return {
          ...c,
          subcategories: sortSubs(c.subcategories, KIT_SUB_ORDER),
        };
      }
      return c;
    });

  // Push exactly ONE unified CCTV entry at the top
  list.unshift({
    _id: security?._id || "dept-cctv",
    name: "CCTV",
    href: SECURITY_HUB_PATH,
    filterName: SECURITY_CATEGORY_NAME,
    subcategories: sortSubs(
      secSubs.length ? secSubs : security?.subcategories || [],
      camRec
    ),
  });

  if (!list.some((c) => c.name === "Kits")) {
    list.push({ _id: "dept-kits", name: "Kits", subcategories: [] });
  }

  // Deduplicate by display name so CCTV Cameras never appears twice
  const seenNames = new Set();
  const deduped = [];
  for (const item of list) {
    const dispName = getCategoryDisplayName(item.name);
    if (seenNames.has(dispName)) continue;
    seenNames.add(dispName);
    deduped.push(item);
  }

  const rank = (c) => {
    const i = DEPARTMENT_ORDER.indexOf(c.name);
    return i === -1 ? DEPARTMENT_ORDER.length : i;
  };
  return deduped
    .map((c, idx) => ({ c, idx }))
    .sort((x, y) => rank(x.c) - rank(y.c) || x.idx - y.idx)
    .map(({ c }) => c);
};

/**
 * Storefront URL for a category / subcategory.
 * Living brand (Curtains label) → `/living`.
 * Security Cameras → collection filter URL.
 * Living product shops use LIVING_SHOP_PATHS when linking from Living pages.
 */
export const getCategoryPath = (categoryName, subcategorySlug) => {
  if (isSecurityCategory(categoryName) && !subcategorySlug) {
    return SECURITY_HUB_PATH;
  }

  const hub = CATEGORY_HUB_PATHS[categoryName];
  if (hub && !subcategorySlug) return hub;

  const base = `/collection?category=${encodeURIComponent(categoryName)}`;
  if (!subcategorySlug) return base;

  return `${base}&subcategory=${encodeURIComponent(subcategorySlug)}`;
};

/** Living product-category shop URL (curtains/bedsheets/…), not the brand hub. */
export const getLivingShopPath = (categoryName) =>
  LIVING_SHOP_PATHS[categoryName] || getCategoryPath(categoryName);

/** Helper to identify actual CAMERA products (Bullet, Turret, Dome, Network Cameras) */
export const isCameraProduct = (product) => {
  if (!product) return false;
  const name = (product?.name || "").toLowerCase();
  const cat = (product?.category || "").toLowerCase();
  const sub = (product?.subCategory || "").toLowerCase();

  // Exclude accessories / plastic boxes / brackets / cables / cabinets / connectors / cards
  if (
    cat === "accessories" ||
    /box|cabinet|bracket|cable|connector|card|mount/i.test(name)
  ) {
    return false;
  }

  // Exclude DVR / NVR / Recorders
  if (/dvr|nvr|recorder/i.test(name) || /recorder/i.test(sub)) {
    return false;
  }

  // Must match camera types
  return (
    /camera|bullet|turret|dome|ptz|colorvu/i.test(name) ||
    /camera/i.test(sub) ||
    (cat === "security cameras" && !/dvr|nvr|recorder|box/i.test(name))
  );
};

export const isCctvProduct = isCameraProduct;

/**
 * Prioritizes Camera products first, then other products.
 */
export const prioritizeCctvProducts = (products = []) => {
  return [...products].sort((a, b) => {
    const aCam = isCameraProduct(a) ? 1 : 0;
    const bCam = isCameraProduct(b) ? 1 : 0;
    if (aCam !== bCam) return bCam - aCam;
    return 0;
  });
};
