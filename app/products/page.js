"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, MapPin, Calendar, Layers, Smartphone, Laptop, Watch, Search, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import BookingModal from "@/components/BookingModal";
import api from "@/utils/api"; // 👈 আমাদের তৈরি করা ডাইনামিক এপিআই ইনস্ট্যান্স

export default function ProductsPage() {
  // ⚙️ কোয়েরি ও ফিল্টার স্টেটস
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  // 📦 ডাটা ও লোডিং স্টেটস
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const itemsPerPage = 4; // প্রতি পেজে কয়টি করে ডাটা রেন্ডার হবে (সার্ভার সাইড সাইজ)

  // 🔄 মঙ্গোডিবি সার্ভার থেকে ডাটা ফেচ করার ডাইনামিক মেকানিজম
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        // ব্যাকএন্ডের এপিআই ফরম্যাট অনুযায়ী কুয়েরি প্যারামস পাঠানো হচ্ছে
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
        console.error("Error fetching data from MongoDB:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // ইউজার টাইপ করার সাথে সাথে যেন বারবার হিট না হয়, তার জন্য একটি ছোট ডিবাউন্স এফেক্ট
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, searchQuery, selectedCategory, sortOrder]);

  return (
    <div className="bg-[#0f172a] text-slate-100 min-h-screen font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
            Explore Marketplace
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-2">
            Real-time synchronization powered by MongoDB Atlas & Express Server production cluster.
          </p>
        </div>

        {/* SEARCH, SORT & FILTER PANEL */}
        <div className="bg-[#1e293b]/40 border border-slate-800 p-4 rounded-3xl backdrop-blur-md mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* সার্চ ফিল্ড */}
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

          {/* সর্টিং ড্রপডাউন (সার্ভার সাইড সর্ট ভ্যালু ম্যাচ করে) */}
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

        {/* CATEGORY TABS */}
        <div className="flex flex-wrap justify-center items-center gap-2.5 mb-10 bg-slate-900/30 p-1.5 rounded-2xl border border-slate-800/60 w-max mx-auto">
          {[
            { label: "All Items", value: "" },
            { label: "Electronics", value: "Electronics" },
            { label: "Furniture", value: "Furniture" },
            { label: "Vehicles", value: "Vehicles" }
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

        {/* PRODUCTS RENDER & SKELETON LOADER */}
        {isLoading ? (
          /* 💀 সুপিরিয়র কঙ্কাল (Skeleton) লোডার রিকোয়ারমেন্ট অনুযায়ী */
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
            No live products found inside MongoDB cluster right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {products.map((product) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#1e293b]/40 border border-slate-800/80 rounded-3xl overflow-hidden backdrop-blur-md flex flex-col group hover:border-slate-700 transition-all"
              >
                <div className="h-48 bg-slate-900 overflow-hidden relative">
                  <img 
                    src={product.images?.[0] || product.image || "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=600"} 
                    alt={product.title} 
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" 
                  />
                  <span className="absolute bottom-3 left-3 text-[10px] uppercase font-extrabold bg-slate-900/80 text-cyan-400 border border-slate-700 px-2 rounded-md">
                    {product.condition || "Good"}
                  </span>
                </div>
                <div className="p-5 flex flex-col flex-grow justify-between">
                  <div>
                    <span className="text-[9px] text-[#06b6d4] font-black uppercase tracking-widest block mb-1">{product.category}</span>
                    <h3 className="text-base font-bold text-slate-100 truncate">{product.title}</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5 truncate">Seller: {product.sellerInfo?.name || "Verified Seller"}</p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                    <div>
                      <p className="text-base font-black text-emerald-400">৳{(product.price || product.resalePrice || 0).toLocaleString()}</p>
                    </div>
                    <button 
                      onClick={() => setSelectedProduct(product)} 
                      className="bg-slate-800 hover:bg-[#06b6d4] text-slate-300 hover:text-slate-900 text-xs font-bold px-3 py-2 rounded-xl border border-slate-700 hover:border-[#06b6d4] transition-all flex items-center space-x-1"
                    >
                      <ShieldCheck className="h-3.5 w-3.5" /><span>Book Now</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* PAGINATION CONTROLS */}
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

      {/* GLOBAL BOOKING MODAL */}
      <AnimatePresence>
        {selectedProduct && (
          <BookingModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}