import React, { useRef } from "react";
import ProductItem from "./ProductItem";
import SectionHeader from "./SectionHeader";
import { IconChevronLeft, IconChevronRight } from "./ui/Icons";

const ProductRail = ({
  eyebrow,
  title,
  viewAllTo = "/collection",
  products = [],
  emptyText = "No products available right now.",
  sectionIcon = "flame",
  accent = "purple",
}) => {
  const scrollerRef = useRef(null);

  const scrollByCard = (direction) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector("[data-rail-card]");
    const step = card ? card.offsetWidth + 16 : 280;
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  return (
    <section className="py-6 sm:py-8">
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        viewAllTo={viewAllTo}
        icon={sectionIcon}
        accent={accent}
      />

      {products.length === 0 ? (
        <p className="rounded-[6px] border border-dashed border-kaboz-line bg-white px-4 py-10 text-center text-sm text-kaboz-mute">
          {emptyText}
        </p>
      ) : (
        <div className="relative">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            aria-label="Previous products"
            className="absolute -left-1 top-[36%] z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border-2 border-black bg-white text-black shadow-sm transition hover:bg-black hover:text-white sm:flex lg:-left-2"
          >
            <IconChevronLeft className="h-5 w-5" strokeWidth={2.75} />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            aria-label="Next products"
            className="absolute -right-1 top-[36%] z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border-2 border-black bg-white text-black shadow-sm transition hover:bg-black hover:text-white sm:flex lg:-right-2"
          >
            <IconChevronRight className="h-5 w-5" strokeWidth={2.75} />
          </button>

          <div
            ref={scrollerRef}
            className="flex gap-3 overflow-x-auto scroll-smooth pb-1 sm:gap-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {products.map((item) => (
              <div
                key={item._id}
                data-rail-card
                className="w-[44%] min-w-[148px] flex-shrink-0 sm:w-[calc((100%-4*1rem)/5)] sm:min-w-[190px]"
              >
                <ProductItem
                  id={item._id}
                  slug={item.slug}
                  image={item.image}
                  name={item.name}
                  price={item.price}
                  originalPrice={item.originalPrice}
                  curtainTypes={item.curtainTypes}
                  category={item.category}
                  subCategory={item.subCategory}
                  sku={item.sku}
                  brand={item.brand}
                  modelName={item.modelName}
                  variant="light"
                  compact
                  date={item.date}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductRail;
