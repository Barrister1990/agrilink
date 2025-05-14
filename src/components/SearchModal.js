import useProductStore from "@/store/useProductStore";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect, useState } from "react";

const SearchModal = ({ isOpen, onClose, searchQuery }) => {
  const [searchResults, setSearchResults] = useState([]);
  const searchProducts = useProductStore.getState().searchProducts;
  const fetchAllProducts = useProductStore((state) => state.fetchAllProducts);
  const products = useProductStore((state) => state.products);

  useEffect(() => {
    if (products.length === 0) {
      fetchAllProducts();
    }
  }, [fetchAllProducts, products.length]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
    } else {
      const results = searchProducts(searchQuery);
      setSearchResults(results);
    }
  }, [searchQuery]);

  return (
    <div
      className={`fixed inset-0 backdrop-blur-md backdrop-opacity-40 transition-opacity ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      } z-50 flex justify-center items-start pt-24 pointer-events-none`}
    >
      <div
        className="bg-white max-w-lg w-full mx-auto rounded-lg shadow-lg p-4 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <div className="flex justify-end">
          <button onClick={onClose}>
            <XMarkIcon className="h-6 w-6 text-gray-500 hover:text-red-500" />
          </button>
        </div>

        {/* Search Results Heading */}
        <h2 className="text-lg font-semibold text-gray-800 mt-2 mb-3">
          Search Results
        </h2>

        {/* Search Results */}
        {searchQuery && (
          <div className="mt-2 max-h-60 overflow-y-auto">
            {searchResults.length > 0 ? (
              searchResults.map((product) => (
                <Link
                  key={product.id}
                  href={`/all-products/${product.id}`} // Navigate to the product page
                  className="p-2 border-b flex items-center gap-3 hover:bg-gray-100 transition"
                  onClick={onClose} // Close modal on click
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 rounded"
                  />
                  <div>
                    <h3 className="text-sm font-medium">{product.name}</h3>
                    <p className="text-sm text-gray-500">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-500 text-center mt-3">No results found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchModal;
