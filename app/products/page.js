"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, Search, ArrowUpDown, ChevronLeft, ChevronRight, Eye, AlertCircle } from "lucide-react";
import api from "@/utils/api"; 
import { useAuth } from "@/context/AuthContext"; 

export default function ProductsPage() {
  const router = useRouter(); 
  const { user } = useAuth(); 
  
  // Filter and pagination states
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Products and loading states
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const itemsPerPage = 4; 

  // Fetch products with search, filter, and pagination support
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/products`, {
          params: {
            page: currentPage,
            size: itemsPerPage,
            search: searchQuery,
            category: selectedCategory,
            sort: sortOrder
          }
        });
        
        if (response.data) {
          setProducts(response.data.products || []);
          setTotalPages(response.data.totalPages || 1);
        }
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce search input to reduce API requests
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, searchQuery, selectedCategory, sortOrder]);

  // Handle product booking
  const handleBookNow = (product) => {
    // Stop booking if item is sold
    if (product.status === "sold" || product.isSold) return;

    // Require login before booking
    if (!user) {
      alert("Please log in to book this product!");
      router.push("/login"); 
      return;
    }

    router.push(`/dashboard/payment/${product._id}`);
  };

  return (
    <div className="bg-[#0f172a] text-slate-100 min-h-screen font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header section */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
            Explore Marketplace
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-2">
            Discover verified pre-owned products at the best prices.
          </p>
        </div>

        {/* Search & Sort options */}
        <div className="bg-[#1e293b]/40 border border-slate-800 p-4 rounded-3xl backdrop-blur-md mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <input 
              type="text"
              placeholder="Search by product title..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full bg-slate-900 border border-slate-800 focus:border-[#06b6d4] pl-10 pr-4 py-2.5 rounded-2xl text-xs text-white focus:outline-none transition-colors"
            />
            <Search className="absolute left-3.5 top-3.5 h-3.5 w-3.5 text-slate-500" />
          </div>

          {/* Sort dropdown */}
          <div className="relative w-full md:w-56 flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-cyan-500 flex-shrink-0" />
            <select 
              value={sortOrder}
              onChange={(e) => { setSortOrder(e.target.value); setCurrentPage(1); }}
              className="w-full bg-slate-900 border border-slate-800 focus:border-[#06b6d4] px-3 py-2.5 rounded-2xl text-xs text-slate-300 focus:outline-none transition-colors cursor-pointer"
            >
              <option value="">Sort By: Default</option>
              <option value="low-to-high">Price: Low to High</option>
              <option value="high-to-low">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap justify-center items-center gap-2.5 mb-10 bg-slate-900/30 p-1.5 rounded-2xl border border-slate-800/60 w-max mx-auto">
          {[
            { label: "All Items", value: "" },
            { label: "Smartphones", value: "smartphones" },
            { label: "Laptops", value: "laptops" },
            { label: "Smartwatches", value: "smartwatches" }
          ].map((cat) => (
            <button 
              key={cat.value}
              onClick={() => { setSelectedCategory(cat.value); setCurrentPage(1); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${selectedCategory === cat.value ? "bg-[#06b6d4] text-slate-900 shadow-lg shadow-cyan-500/10" : "text-slate-400 hover:text-white"}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Products list & skeleton loader */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-[#1e293b]/20 border border-slate-800/40 h-80 rounded-3xl animate-pulse p-5 space-y-4">
                <div className="bg-slate-800/50 h-40 rounded-2xl w-full" />
                <div className="h-4 bg-slate-800/50 rounded w-2/3" />
                <div className="h-3 bg-slate-800/40 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/20 border border-slate-800 rounded-3xl text-slate-500 text-sm">
            No products found matching your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {products.map((product) => {
              const isSold = product.status === "sold" || product.isSold;
              const imgUrl = product.images?.[0] || product.image || "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=600";

              return (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#1e293b]/40 border border-slate-800/80 rounded-3xl overflow-hidden backdrop-blur-md flex flex-col group hover:border-slate-700 transition-all"
                >
                  {/* Product Thumbnail */}
                  <Link href={`/products/${product._id}`} className="h-52 bg-slate-950 overflow-hidden relative block">
                    {/* Blurred backdrop image */}
                    <img 
                      src={imgUrl} 
                      alt="" 
                      aria-hidden="true"
                      className="absolute inset-0 w-full h-full object-cover blur-md scale-110 opacity-30 brightness-75" 
                    />

                    {/* Main image */}
                    <img 
                      src={imgUrl} 
                      alt={product.title} 
                      className={`relative z-10 w-full h-full object-contain p-2 transition-all duration-500 ${
                        isSold ? "grayscale opacity-60" : "group-hover:scale-105"
                      }`} 
                    />

                    {/* Condition badge */}
                    <span className="absolute bottom-3 left-3 text-[10px] uppercase font-extrabold bg-slate-900/90 text-cyan-400 border border-slate-700/80 px-2 py-0.5 rounded-md z-20 backdrop-blur-md">
                      {product.condition || "Good"}
                    </span>

                    {/* Sold Out badge */}
                    {isSold && (
                      <span className="absolute top-3 right-3 text-[10px] uppercase font-black bg-rose-600/90 text-white px-3 py-1 rounded-full shadow-lg z-20 backdrop-blur-md border border-rose-500/50">
                        Sold Out
                      </span>
                    )}
                  </Link>

                  <div className="p-5 flex flex-col flex-grow justify-between">
                    <div>
                      <span className="text-[9px] text-[#06b6d4] font-black uppercase tracking-widest block mb-1">{product.category}</span>
                      
                      <Link href={`/products/${product._id}`}>
                        <h3 className="text-base font-bold text-slate-100 truncate hover:text-cyan-400 transition-colors">
                          {product.title}
                        </h3>
                      </Link>
                      
                      <p className="text-[11px] text-slate-400 mt-0.5 truncate">Seller: {product.sellerInfo?.name || "Verified Seller"}</p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center justify-between gap-2">
                      <div>
                        <p className={`text-base font-black ${isSold ? "text-slate-500 line-through" : "text-emerald-400"}`}>
                          ৳{(product.price || product.resalePrice || 0).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* View Details button */}
                        <Link 
                          href={`/products/${product._id}`}
                          className="bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold p-2.5 rounded-xl border border-slate-800 transition-all"
                          title="View Details"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Link>

                        {/* Booking action button */}
                        {isSold ? (
                          <button 
                            disabled 
                            className="bg-slate-900 text-slate-500 text-xs font-bold px-3 py-2 rounded-xl border border-slate-800 cursor-not-allowed flex items-center space-x-1"
                          >
                            <AlertCircle className="h-3.5 w-3.5" />
                            <span>Sold Out</span>
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleBookNow(product)} 
                            className="bg-slate-800 hover:bg-[#06b6d4] text-slate-300 hover:text-slate-900 text-xs font-bold px-3 py-2 rounded-xl border border-slate-700 hover:border-[#06b6d4] transition-all cursor-pointer flex items-center space-x-1"
                          >
                            <ShieldCheck className="h-3.5 w-3.5" />
                            <span>Book Now</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Pagination navigation */}
        {!isLoading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12 border-t border-slate-800/50 pt-6">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 disabled:opacity-40 disabled:hover:bg-slate-900 rounded-xl transition-all cursor-pointer text-slate-300"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs font-bold font-mono text-slate-400">
              Page <span className="text-cyan-400">{currentPage}</span> of {totalPages}
            </span>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 disabled:opacity-40 disabled:hover:bg-slate-900 rounded-xl transition-all cursor-pointer text-slate-300"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}