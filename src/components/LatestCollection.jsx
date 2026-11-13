import React, { useContext, useMemo } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

const LatestCollection = () => {
    const { products } = useContext(ShopContext);

    // No need for useState + useEffect just to slice an array —
    // useMemo recomputes only when `products` actually changes.
    const latestProducts = useMemo(() => {
        return [...products]
            .sort((a, b) => (b.date || 0) - (a.date || 0)) // newest first, if a date field exists
            .slice(0, 10);
    }, [products]);

    return (
        <div className='my-10'>
            <div className='text-center py-8 text-3xl'>
                <Title text1={'HOT'} text2={'PRODUCTS'} />
                <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
                    Discover the newest additions to our store. Handpicked for style, quality, and the latest trends – shop our latest collections now!
                </p>
            </div>

            {/* Rendering products */}
            {latestProducts.length === 0 ? (
                <p className='text-center text-gray-500 py-10'>No products available right now.</p>
            ) : (
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 gap-y-6'>
                    {latestProducts.map((item) => (
                        <ProductItem
                            key={item._id}
                            id={item._id}
                            slug={item.slug}
                            image={item.image}
                            name={item.name}
                            price={item.price}
                            originalPrice={item.originalPrice}
                            category={item.category}
                            subCategory={item.subCategory}
                            sku={item.sku}
                            brand={item.brand}
                            modelName={item.modelName}
                            curtainTypes={item.curtainTypes}
                            date={item.date}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default LatestCollection;