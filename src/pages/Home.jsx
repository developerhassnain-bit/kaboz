import React, { useMemo } from "react";
import Hero from "../components/Hero";
import FeatureStrip from "../components/FeatureStrip";
import DealOfTheDay from "../components/DealOfTheDay";
import FeaturedTabs from "../components/FeaturedTabs";
import BestSellerGrid from "../components/BestSellerGrid";
import ProductColumns from "../components/ProductColumns";
import RecentlyViewed from "../components/RecentlyViewed";
import {
  BannerFull,
  BannerQuad,
  BannerPair,
} from "../components/HomeBanner";
import useHomepageSettings from "../hooks/useHomepageSettings";
import { bannersBySlot } from "../utils/homepageProducts";

/**
 * Onsus Home order (after hero + 5 badges):
 * Deal of the Day → banner → Feature/Best Selling/On Sale →
 * 4 square banners → Best Seller (2 rows) → banner →
 * Top20 / Featured / Top Selling / On Sale columns →
 * 2 banners → Recently viewed
 *
 * Visibility / products / banners come from Admin → Homepage settings.
 */
const SECTION_DEFAULTS = [
  { key: "hero", enabled: true, order: 0 },
  { key: "featureStrip", enabled: true, order: 1 },
  { key: "dealOfTheDay", enabled: true, order: 2 },
  { key: "bannerAfterDeal", enabled: true, order: 3 },
  { key: "featuredTabs", enabled: true, order: 4 },
  { key: "bannerQuad", enabled: true, order: 5 },
  { key: "bestSeller", enabled: true, order: 6 },
  { key: "bannerBeforeColumns", enabled: true, order: 7 },
  { key: "productColumns", enabled: true, order: 8 },
  { key: "bannerPair", enabled: true, order: 9 },
  { key: "recentlyViewed", enabled: true, order: 10 },
];

const FALLBACK_BANNERS = {
  afterDeal: {
    to: "/living",
    image: "/after-deal-of-the-day-banner.jpg",
    alt: "Premium Home Textiles",
  },
  beforeColumns: {
    to: "/collection?category=Security%20Cameras",
    image: "/before-products-column-banner.jpg",
    alt: "Advanced Security Solutions",
  },
  quad: [
    {
      slot: "quad1",
      to: "/collection?category=Security%20Cameras",
      image: "/quad-smart-security-deals.png",
      label: "",
      title: "",
      alt: "Deals on Security Cameras & Smart Protection",
    },
    {
      slot: "quad2",
      to: "/collection?category=Kits",
      image: "/quad-neon-security-kits.png",
      label: "",
      title: "",
      alt: "Deals on Ready To Install Security Kits",
    },
    {
      slot: "quad3",
      to: "/collection?category=Network%20Switches",
      image: "/quad-neon-switches-cctv.png",
      label: "",
      title: "",
      alt: "Deals on Switches & PoE For CCTV",
    },
    {
      slot: "quad4",
      to: "/living",
      image: "/quad-curtains-home-comfort.png",
      label: "",
      title: "",
      alt: "Deals on Curtains & Home Comfort",
    },
  ],
  pair: [
    {
      slot: "pair1",
      to: "/collection?category=Security%20Cameras",
      image: "/bottom-pair-smart-surveillance.jpg",
      alt: "Smart Surveillance Security Cameras",
    },
    {
      slot: "pair2",
      to: "/collection?category=Access%20Control",
      image: "/bottom-pair-smart-access.jpg",
      alt: "Smart Access & Workplace Security",
    },
  ],
};

const idsFrom = (settings, field) =>
  (settings?.[field] || []).map(String).filter(Boolean);

const Home = () => {
  const { settings } = useHomepageSettings();

  const sections = useMemo(() => {
    const cmsByKey = Object.fromEntries(
      (settings?.sections || []).map((s) => [s.key, s])
    );
    // Always keep canonical layout order: … → 4 promo banners → Best Seller (2 rows) → …
    return SECTION_DEFAULTS.map((def) => {
      const cms = cmsByKey[def.key];
      return {
        ...def,
        enabled: cms ? cms.enabled !== false : def.enabled,
      };
    }).filter((s) => s.enabled !== false);
  }, [settings]);

  const slotMap = useMemo(
    () => bannersBySlot(settings?.homeBanners),
    [settings]
  );

  // Force latest creatives (CMS may still hold older paths)
  const bannerAfterDeal = {
    ...(slotMap.afterDeal || FALLBACK_BANNERS.afterDeal),
    image: FALLBACK_BANNERS.afterDeal.image,
    to: FALLBACK_BANNERS.afterDeal.to,
    alt: FALLBACK_BANNERS.afterDeal.alt,
  };
  const bannerBeforeColumns = {
    ...(slotMap.beforeColumns || FALLBACK_BANNERS.beforeColumns),
    image: FALLBACK_BANNERS.beforeColumns.image,
    to: FALLBACK_BANNERS.beforeColumns.to,
    alt: FALLBACK_BANNERS.beforeColumns.alt,
  };

  const bannerQuad = useMemo(
    () =>
      FALLBACK_BANNERS.quad.map((fallback) => ({
        ...(slotMap[fallback.slot] || {}),
        ...fallback,
      })),
    [slotMap]
  );

  const bannerPair = useMemo(
    () =>
      FALLBACK_BANNERS.pair.map((fallback) => ({
        ...(slotMap[fallback.slot] || {}),
        ...fallback,
      })),
    [slotMap]
  );

  const renderSection = (key) => {
    switch (key) {
      case "hero":
        return <Hero key="hero" />;
      case "featureStrip":
        return <FeatureStrip key="featureStrip" />;
      case "dealOfTheDay":
        return (
          <DealOfTheDay
            key="dealOfTheDay"
            preferredIds={idsFrom(settings, "dealProductIds")}
          />
        );
      case "bannerAfterDeal":
        return (
          <BannerFull key="bannerAfterDeal" item={bannerAfterDeal} />
        );
      case "featuredTabs":
        return (
          <FeaturedTabs
            key="featuredTabs"
            featureIds={idsFrom(settings, "featureTabProductIds")}
            bestSellingIds={idsFrom(settings, "bestSellingTabProductIds")}
            onSaleIds={idsFrom(settings, "onSaleTabProductIds")}
          />
        );
      case "bannerQuad":
        return <BannerQuad key="bannerQuad" items={bannerQuad} />;
      case "bestSeller":
        return (
          <BestSellerGrid
            key="bestSeller"
            preferredIds={idsFrom(settings, "bestsellerProductIds")}
          />
        );
      case "bannerBeforeColumns":
        return (
          <BannerFull
            key="bannerBeforeColumns"
            item={bannerBeforeColumns}
            slim
          />
        );
      case "productColumns":
        return (
          <ProductColumns
            key="productColumns"
            top20Ids={idsFrom(settings, "top20ProductIds")}
            featuredIds={idsFrom(settings, "featuredColumnProductIds")}
            topSellingIds={idsFrom(settings, "topSellingColumnProductIds")}
            onSaleIds={idsFrom(settings, "onSaleColumnProductIds")}
          />
        );
      case "bannerPair":
        return <BannerPair key="bannerPair" items={bannerPair} />;
      case "recentlyViewed":
        return (
          <div key="recentlyViewed" className="kb-container pb-8 sm:pb-10">
            <RecentlyViewed />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-white text-kaboz-ink">
      {sections.map((section) => renderSection(section.key))}
    </div>
  );
};

export default Home;
