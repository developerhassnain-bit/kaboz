import React from "react";
import LivingCategoryLanding from "../components/LivingCategoryLanding";

/** Bedsheets shop — /bedsheets */
const BedsheetsLanding = () => (
  <LivingCategoryLanding
    categories={["Bedsheets"]}
    breadcrumbLabel="Bedsheets"
    title="Bedsheets"
    subtitle="Everyday comfort in quality fabrics. Browse bedsheets for homes and projects across the UAE."
    heroImage="/Idyllic.jpg"
    heroAlt="Kaboz bedsheets"
    pageTitle="Bedsheets | Kaboz Living"
    metaDescription="Shop bedsheets at Kaboz Living. Quality everyday bedding for the UAE."
    emptyMessage="No bedsheet products available right now."
  />
);

export default BedsheetsLanding;
