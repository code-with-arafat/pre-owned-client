"use client";
import { useParams } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck, MapPin, Calendar, Phone, ShoppingBag } from "lucide-react";
import Link from "next/link";

// 📦 সেন্ট্রাল ডেমো ডাটা (পরবর্তীতে ডাটাবেজ থেকে ফিল্টার হবে)
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
  }
];

export default function CategoryPage() {
  const params = useParams();
  // URL থেকে ক্যাটাগরির নাম নেওয়া হচ্ছে (যেমন: smartphones, laptops)
  const categoryName = params.name ? params.name.toLowerCase() : "";

  // 🎯 ইউআরএল প্যারামস অনুযায়ী প্রোডাক্ট ফিল্টার
  const filteredProducts = allProducts.filter(
    (product) => product.category === categoryName
  );

  return (
    <div className="bg-[#0f172a] text-slate-100 min-h-screen font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* 🔙 BACK BUTTON & HEADER */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Link href="/" className="inline-flex items-center space-x-2 text-sm font-bold text-[#06b6d4] hover:underline mb-3 group">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home</span>
            </Link>
            <h1 className="text-3xl sm:text-4xl font-black capitalize tracking-tight">
              Category: <span className="bg-gradient-to-r from-[#059669] to-[#06b6d4] bg-clip-text text-transparent">{categoryName}</span>
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Showing verified pre-owned {categoryName} available in the marketplace.
            </p>
          </div>
          
          <div className="bg-slate-800/40 border border-slate-800 px-4 py-2 rounded-xl text-xs text-slate-400 font-medium self-start sm:self-auto">
            Found: <span className="text-emerald-400 font-bold font-mono">{filteredProducts.length} Items</span>
          </div>
        </div>

        {/* ❌ NO PRODUCTS FOUND CASE */}
        {filteredProducts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="text-center py-20 bg-[#1e293b]/20 border border-slate-800/60 rounded-3xl backdrop-blur-sm"
          >
            <ShoppingBag className="h-12 w-12 text-slate-600 mx-auto mb-4 animate-bounce" />
            <h3 className="text-lg font-bold text-slate-300">No Items Found!</h3>
            <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
              Currently there are no registered products under this section. Check back later or try another category.
            </p>
          </motion.div>
        ) : (
          /* 📱 PRODUCTS GRID */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className="bg-[#1e293b]/40 border border-slate-800/80 rounded-3xl overflow-hidden backdrop-blur-md flex flex-col group hover:border-slate-700 transition-all duration-300"
              >
                {/* Image Wrap */}
                <div className="h-56 bg-slate-900 border-b border-slate-800 overflow-hidden relative">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute bottom-3 left-3 text-[10px] uppercase tracking-wider font-extrabold bg-slate-900/80 text-cyan-400 border border-slate-700/80 px-2.5 py-1 rounded-md backdrop-blur-md">
                    {product.condition}
                  </span>
                </div>

                {/* Content Wrap */}
                <div className="p-6 flex flex-col flex-grow justify-between">
                  <div>
                    <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">
                      <span>Seller: {product.seller}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-100 group-hover:text-white transition-colors leading-snug">
                      {product.title}
                    </h3>

                    {/* Meta specification row */}
                    <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-800/60 text-xs text-slate-400">
                      <div className="flex items-center space-x-1.5">
                        <Calendar className="h-3.5 w-3.5 text-[#06b6d4]" />
                        <span>Used: <strong className="text-slate-200 font-semibold">{product.yearsOfUse}</strong></span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <MapPin className="h-3.5 w-3.5 text-rose-500" />
                        <span className="truncate">{product.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Action Button */}
                  <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-slate-500 line-through">Original: ৳{product.originalPrice.toLocaleString()}</p>
                      <p className="text-xl font-black text-emerald-400 mt-0.5">৳{product.resalePrice.toLocaleString()}</p>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-slate-800 hover:bg-[#06b6d4] text-slate-300 hover:text-slate-900 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700 hover:border-[#06b6d4] transition-all flex items-center space-x-1.5 shadow-md shadow-black/20"
                    >
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>Book Now</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}