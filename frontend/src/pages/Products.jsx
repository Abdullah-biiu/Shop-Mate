import { Search, Sparkles, Star, Filter } from "lucide-react";
import { categories } from "../data/products";
import ProductCard from "../components/Products/ProductCard";
import Pagination from "../components/Products/Pagination";
import AISearchModal from "../components/Products/AISearchModal";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchAllProducts } from "../store/slices/productSlice";
import { toggleAIModal } from "../store/slices/popupSlice";


const Products = () => {
  const dispatch = useDispatch();

  const { products, totalProducts, loading } = useSelector(
    (state) => state.product
  );

  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };

  const query = useQuery();

  const searchTerm = query.get("search");
  const searchedCategory = query.get("category");

  const [searchQuery, setSearchQuery] = useState(searchTerm || "");
  const [selectedCategory, setSelectedCategory] = useState(
    searchedCategory || ""
  );

  // FIXED
  const [priceRange, setPriceRange] = useState([0, 10000]);

  const [selectedRating, setSelectedRating] = useState(0);
  const [availability, setAvailability] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    dispatch(
      fetchAllProducts({
        category: selectedCategory,
        price: `${priceRange[0]}-${priceRange[1]}`,
        search: searchQuery,
        ratings: selectedRating,
        availability,
        page: currentPage,
      })
    );
  }, [
    dispatch,
    selectedCategory,
    priceRange,
    searchQuery,
    selectedRating,
    availability,
    currentPage,
  ]);

  const totalPages = Math.ceil(totalProducts / 10);

  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-4">
        {/* Mobile Filter Button */}
        <button
          onClick={() =>
            setIsMobileFilterOpen(!isMobileFilterOpen)
          }
          className="lg:hidden mb-4 p-3 glass-card hover:glow-on-hover animate-smooth flex items-center gap-2"
        >
          <Filter className="w-5 h-5" />
          <span>Filters</span>
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* ================= FILTERS ================= */}
          <aside
            className={`${
              isMobileFilterOpen ? "block" : "hidden"
            } lg:block w-full lg:w-80`}
          >
            <div className="glass-panel p-6 rounded-xl">
              <h2 className="text-2xl font-bold mb-6">
                Filters
              </h2>

              {/* SEARCH */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Search</h3>

                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4" />

                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) =>
                      setSearchQuery(e.target.value)
                    }
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-background border border-border"
                  />
                </div>
              </div>

              {/* CATEGORY */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">
                  Category
                </h3>

                <select
                  value={selectedCategory}
                  onChange={(e) =>
                    setSelectedCategory(e.target.value)
                  }
                  className="w-full p-2 rounded-lg bg-background border border-border"
                >
                  <option value="">All Categories</option>

                  {categories?.map((category) => (
                    <option
                      key={category.id || category.name}
                      value={category.name}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* PRICE RANGE */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">
                  Price Range
                </h3>

                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="100"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([
                      0,
                      Number(e.target.value),
                    ])
                  }
                  className="w-full"
                />

                <div className="flex justify-between mt-2 text-sm font-medium">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>

              {/* RATING */}
              <div className="mb-6">
                <h3 className=" text-lg font-medium text-foreground mb-3">
                  Rating
                </h3>
                  <div className="space-y-2">
                {[4, 3, 2, 1].map((rating) => {
                  return (
                  <button
                    key={rating}
                    onClick={() =>
                      setSelectedRating(rating)
                    }
                    className={`flex items-center space-x-2 w-full p-2 rounded ${
                      selectedRating === rating
                        ? "bg-primary/20"
                        : "hover:bg-secondary"
                    }`}
                  >
                    {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i <
                        rating
                        
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  </button>
                  );
               })}
               </div>
              </div>

              {/* STOCK */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-foreground mb-3">
                  Availability
                </h3>

                <div className="space-y-2">
                  {["in-stock", "limited", "out-of-stock"].map((status)=>{
                    return(
                      <button key={status}
                      onClick={()=>
                        setAvailability(
                          availability === status ? "": status

                        )
                      }
                      className={`w-full p-2 text-left rounded${
                        availability === status
                        ? "bg-primary/20"
                        : "hover:bg-secondary"

                      }`}
                      >
                        {
                          status === "in-stock" ? "In Stock" :status === "limited" ? "Limited  Stock" :
                          "Out Of Stock"
                        }

                      </button>
                    )
                  })}

                </div>
              </div>
            </div>
          </aside>

          {/* ================= PRODUCTS ================= */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">
                Products
              </h1>

               <button 
                className="relative inline-flex items-center 
justify-center p-0.5  
                overflow-hidden text-sm font-medium text-gray-900 
rounded-lg group  
                bg-gradient-to-br from-purple-500 to-pink-500 
group-hover:from-purple-500  
                group-hover:to-pink-500 hover:text-white 
dark:text-white focus:ring-4  
                focus:outline-none focus:ring-purple-200  
                dark:focus:ring-purple-800 max-[440px]:min-w-full 
min-w-[132px]" 
                onClick={() => dispatch(toggleAIModal())} 
              > 
                <span className="relative w-full px-5 py-3 
transition-all ease-in duration-75  
                bg-white dark:bg-gray-900 rounded-md 
group-hover:bg-transparent  
                group-hover:dark:bg-transparent flex justify-center 
items-center gap-2"> 
                  <Sparkles className="w-5 h-5" /> 
                  <span>AI Search</span> 
                </span> 
              </button>
            </div>

            {loading ? (
              <div className="text-center py-20">
                Loading products...
              </div>
            ) : products?.length === 0 ? (
              <div className="text-center py-20">
                No products found.
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard
                      key={product._id || product.id}
                      product={product}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-10">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      <AISearchModal />
    </div>
  );
};

export default Products;