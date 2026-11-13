import React from "react";
import LivingCategoryLanding from "../components/LivingCategoryLanding";

/** Curtains shop — /curtains */
const CurtainsShopLanding = () => (
  <LivingCategoryLanding
    categories={["Curtains"]}
    breadcrumbLabel="Curtains"
    title="Curtains"
    subtitle="Blackout, sheer, velvet and more. Open a product to choose design and color options."
    heroImage="/Curtains-banner.jpeg"
    heroAlt="Kaboz curtains"
    pageTitle="Curtains | Kaboz Living"
    metaDescription="Shop curtains at Kaboz Living. Designs with multiple color options for homes and projects in the UAE."
    emptyMessage="No curtain products available right now."
  />
);

export default CurtainsShopLanding;
