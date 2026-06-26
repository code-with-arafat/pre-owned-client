"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, MapPin, Calendar, Layers, Smartphone, Laptop, Watch } from "lucide-react";
import BookingModal from "@/components/BookingModal";

// 📦 সেন্ট্রাল ডেমো ডাটাবেজ (সব ক্যাটাগরির প্রোডাক্ট একসাথে)
const allProducts = [
  {
    id: "p1",
    title: "iPhone 14 Pro Max - Space Black",
    category: "smartphones",
    originalPrice: 120000,
    resalePrice: 85000,
    yearsOfUse: "1.2 Years",
    location: "Rajshahi",
    image: "https://images.unsplash.com/photo-1678652197831-2d180705cd2c?q=80&w=600&auto=format&fit=crop",
    seller: "Arafat Codes",
    condition: "Excellent"
  },
  {
    id: "p2",
    title: "MacBook Air M2 - 8GB/256GB",
    category: "laptops",
    originalPrice: 135000,
    resalePrice: 98000,
    yearsOfUse: "8 Months",
    location: "Dhaka",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop",
    seller: "Rahat Tech",
    condition: "Like New"
  },
  {
    id: "p3",
    title: "Apple Watch Series 8 Ultra",
    category: "smartwatches",
    originalPrice: 45000,
    resalePrice: 32000,
    yearsOfUse: "5 Months",
    location: "Rajshahi",
    image: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?q=80&w=600&auto=format&fit=crop",
    seller: "Zayan Gadgets",
    condition: "Excellent"
  },
  {
    id: "p4",
    title: "Samsung Galaxy S23 Ultra",
    category: "smartphones",
    originalPrice: 130000,
    resalePrice: 79000,
    yearsOfUse: "1 Year",
    location: "Chittagong",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600&auto=format&fit=crop",
    seller: "Alif Electronics",
    condition: "Good"
  },
  {
    id: "p5",
    title: "Dell XPS 13 9315 Plus",
    category: "laptops",
    originalPrice: 165000,
    resalePrice: 110000,
    yearsOfUse: "1.5 Years",
    location: "Sylhet",
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=600&auto=format&fit=crop",
    seller: "Asif Laptops",
    condition: "Fair"
  }
];

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(null);

  //  ফিল্টারিং লজিক
  const filteredProducts = selectedCategory === "all" 
    ? allProducts 
    : allProducts.filter(p => p.category === selectedCategory);

  return (
    <div className="bg-[#0f172a] text-slate-100 min-h-screen font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
            Explore All Products
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-3 leading-relaxed">
            Browse through our expansive collection of pre-owned, verified and budget-friendly premium electronics listed by trusted sellers.
          </p>
        </div>

        {/* PREMIUM TAB FILTERS */}
        <div className="flex flex-wrap justify-center items-center gap-3 mb-12 bg-slate-900/50 p-2 rounded-2xl border border-slate-800 w-max mx-auto backdrop-blur-md">
          <button 
            onClick={() => setSelectedCategory("all")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedCategory === "all" ? "bg-[#06b6d4] text-slate-900 shadow-md shadow-cyan-500/10" : "text-slate-400 hover:text-white"}`}
          >
            <Layers className="h-3.5 w-3.5" /> <span>All Items</span>
          </button>
          
          <button 
            onClick={() => setSelectedCategory("smartphones")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedCategory === "smartphones" ? "bg-[#06b6d4] text-slate-900 shadow-md shadow-cyan-500/10" : "text-slate-400 hover:text-white"}`}
          >
            <Smartphone className="h-3.5 w-3.5" /> <span>Smartphones</span>
          </button>

          <button 
            onClick={() => setSelectedCategory("laptops")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedCategory === "laptops" ? "bg-[#06b6d4] text-slate-900 shadow-md shadow-cyan-500/10" : "text-slate-400 hover:text-white"}`}
          >
            <Laptop className="h-3.5 w-3.5" /> <span>Laptops</span>
          </button>

          <button 
            onClick={() => setSelectedCategory("smartwatches")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedCategory === "smartwatches" ? "bg-[#06b6d4] text-slate-900 shadow-md shadow-cyan-500/10" : "text-slate-400 hover:text-white"}`}
          >
            <Watch className="h-3.5 w-3.5" /> <span>Smartwatches</span>
          </button>
        </div>

        {/* CARD LISTINGS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -6 }}
              className="bg-[#1e293b]/40 border border-slate-800/80 rounded-3xl overflow-hidden backdrop-blur-md flex flex-col group hover:border-slate-700 transition-all duration-300"
            >
              {/* Image Container */}
              <div className="h-52 bg-slate-900 border-b border-slate-800 overflow-hidden relative">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-3 left-3 text-[10px] uppercase tracking-wider font-extrabold bg-slate-900/80 text-cyan-400 border border-slate-700/80 px-2.5 py-1 rounded-md backdrop-blur-md">
                  {product.condition}
                </span>
              </div>

              {/* Info Area */}
              <div className="p-6 flex flex-col flex-grow justify-between">
                <div>
                  <span className="text-[10px] text-[#06b6d4] font-black uppercase tracking-widest block mb-1">
                    {product.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-100 group-hover:text-white transition-colors leading-snug">
                    {product.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">Seller: {product.seller}</p>

                  {/* Metadata Row */}
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-800/60 text-xs text-slate-400">
                    <div className="flex items-center space-x-1.5">
                      <Calendar className="h-3.5 w-3.5 text-cyan-400" />
                      <span>Used: <strong className="text-slate-200 font-semibold">{product.yearsOfUse}</strong></span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <MapPin className="h-3.5 w-3.5 text-rose-500" />
                      <span className="truncate">{product.location}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Section */}
                <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-500 line-through">Orig: ৳{product.originalPrice.toLocaleString()}</p>
                    <p className="text-lg font-black text-emerald-400">৳{product.resalePrice.toLocaleString()}</p>
                  </div>

                  <motion.button
                    onClick={() => setSelectedProduct(product)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-slate-800 hover:bg-[#06b6d4] text-slate-300 hover:text-slate-900 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700 hover:border-[#06b6d4] transition-all flex items-center space-x-1.5"
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Book Now</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* GLOBAL BOOKING MODAL FOR THIS PAGE */}
      <AnimatePresence>
        {selectedProduct && (
          <BookingModal 
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}