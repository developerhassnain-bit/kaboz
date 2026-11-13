import React, { useContext, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'

const MAX_RESULTS = 6

const SearchBar = () => {
    const { search, setSearch, showSearch, setShowSearch, products, currency } =
        useContext(ShopContext)
    const [focused, setFocused] = useState(false)
    const wrapperRef = useRef(null)
    const navigate = useNavigate()

    const results = useMemo(() => {
        if (!search.trim()) return []
        const q = search.toLowerCase()
        return products
            .filter((item) => item.name.toLowerCase().includes(q))
            .slice(0, MAX_RESULTS)
    }, [search, products])

    const showDropdown = focused && search.trim().length > 0

    const closeSearch = () => {
        setShowSearch(false)
        setSearch('')
        setFocused(false)
    }

    const goToProduct = (item) => {
        closeSearch()
        navigate(`/product/${item.slug}`)
    }

    const goToAllResults = () => {
        closeSearch()
        navigate(`/collection?search=${encodeURIComponent(search)}`)
    }

    return showSearch ? (
        <div ref={wrapperRef} className="hidden sm:block border-t border-b bg-gray-50 text-center relative">
            <div className="inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2 relative">
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setTimeout(() => setFocused(false), 150)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && search.trim()) goToAllResults()
                    }}
                    className="flex-1 outline-none bg-inherit text-sm"
                    type="text"
                    placeholder="Search"
                />
                <img className="w-4" src={assets.search_icon} alt="" />

                {/* Live results dropdown */}
                {showDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl text-left z-[500] overflow-hidden">
                        {results.length === 0 ? (
                            <p className="px-4 py-3 text-sm text-gray-400">
                                No products found.
                            </p>
                        ) : (
                            <>
                                <div className="max-h-[320px] overflow-y-auto divide-y divide-gray-100">
                                    {results.map((item) => (
                                        <button
                                            key={item._id}
                                            type="button"
                                            onClick={() => goToProduct(item)}
                                            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 text-left"
                                        >
                                            <img
                                                src={item.image?.[0]}
                                                alt={item.name}
                                                className="w-10 h-10 object-cover rounded flex-shrink-0"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-gray-800 truncate">
                                                    {item.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {currency}
                                                    {item.price}
                                                </p>
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    onClick={goToAllResults}
                                    className="w-full py-2.5 text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border-t border-gray-200"
                                >
                                    See all results for "{search}"
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>

            <img
                onClick={closeSearch}
                className="inline w-3 cursor-pointer"
                src={assets.cross_icon}
                alt=""
            />
        </div>
    ) : null
}

export default SearchBar