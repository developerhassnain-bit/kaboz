/**
 * Curated circle icons for Shop by category.
 * Keys must match category `name` values from the API.
 */

// Hard crop to a square so object-cover fills the circle edge-to-edge.
const CLOUDINARY_FILL =
  "c_fill,g_auto,w_400,h_400,q_auto,f_auto";

/** Crop Cloudinary shots to a filled square for circle thumbnails. */
export const toCircleIcon = (url) => {
  if (!url || typeof url !== "string") return url;
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return url;
  }
  if (url.includes("c_fill,") || url.includes("c_pad,")) {
    return url.replace(/\/upload\/[^/]+\//, `/upload/${CLOUDINARY_FILL}/`);
  }
  return url.replace("/upload/", `/upload/${CLOUDINARY_FILL}/`);
};

export const categoryIcons = {
  "Security Cameras": toCircleIcon(
    "https://res.cloudinary.com/chhdnzji/image/upload/v1785101468/fl1gdfcvqsagkfbjdpkg.jpg",
  ),
  "Access Control": toCircleIcon(
    "https://res.cloudinary.com/chhdnzji/image/upload/v1785101001/zzi3wsfqsr9z99a4fjdk.jpg",
  ),
  "Video Intercom": toCircleIcon(
    "https://res.cloudinary.com/chhdnzji/image/upload/v1785101053/tvkacbp06v3qj75nwjz5.jpg",
  ),
  "Network Switches": toCircleIcon(
    "https://res.cloudinary.com/chhdnzji/image/upload/v1785100765/jusjoqkaxhqqtndosfvz.jpg",
  ),
  "Software License": toCircleIcon(
    "https://res.cloudinary.com/chhdnzji/image/upload/v1785101139/lu5ratfoyvhxfdkwrqlo.jpg",
  ),
  Kits: toCircleIcon(
    "https://res.cloudinary.com/chhdnzji/image/upload/v1785125678/h2bkjmlbcbsv9mesjqwq.jpg",
  ),
  Accessories: toCircleIcon(
    "https://res.cloudinary.com/chhdnzji/image/upload/v1785100616/srk5l9fs4jyk3glsy799.jpg",
  ),
  Curtains: toCircleIcon(
    "https://res.cloudinary.com/chhdnzji/image/upload/v1785457230/koklgoxg8m0vk5erhdva.png",
  ),
  "Luxury Bedsheets": toCircleIcon(
    "https://res.cloudinary.com/chhdnzji/image/upload/v1788189805/tzdgqgjgqp5kydqji00y.jpg",
  ),
  Upholstery: toCircleIcon(
    "https://res.cloudinary.com/chhdnzji/image/upload/v1788189889/nt8t6aq1lkv4i6yfwazr.jpg",
  ),
  Bedsheets: toCircleIcon(
    "https://res.cloudinary.com/chhdnzji/image/upload/v1788189687/vzx0l87jjzqin66fqhm5.jpg",
  ),
};
