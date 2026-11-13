import React from "react";
import LivingCategoryLanding from "../components/LivingCategoryLanding";

/** Upholstery shop — /upholstery */
const UpholsteryLanding = () => (
  <LivingCategoryLanding
    categories={["Upholstery"]}
    breadcrumbLabel="Upholstery"
    title="Upholstery"
    subtitle="Sofas, beds, chairs and custom fabric work. Browse fabrics and finishes for your space."
    heroImage="/Terra.jpg"
    heroAlt="Kaboz upholstery"
    pageTitle="Upholstery | Kaboz Living"
    metaDescription="Shop upholstery fabrics and finishes at Kaboz Living for homes and projects in the UAE."
    emptyMessage="No upholstery products available right now."
  />
);

export default UpholsteryLanding;
