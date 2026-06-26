"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Laptop, Smartphone, Watch, ArrowRight, Sparkles, ShieldCheck, Zap } from "lucide-react";

// ডেমো ডেটা: ক্যাটাগরি লিস্ট
const categories = [
  { id: 1, name: "Smartphones", icon: Smartphone, count: "120+ Items", color: "from-emerald-500/20 to-teal-500/10", border: "hover:border-emerald-500/50" },
  { id: 2, name: "Laptops", icon: Laptop, count: "85+ Items", color: "from-cyan-500/20 to-blue-500/10", border: "hover:border-cyan-500/50" },
  { id: 3, name: "Smartwatches", icon: Watch, count: "45+ Items", color: "from-amber-500/20 to-orange-500/10", border: "hover:border-amber-500/50" },
];

// ডেমೋ ডেটা: অ্যাডভার্টাইজড প্রোডাক্টস (পরবর্তীতে ডাটাবেজ থেকে আসবে)
const advertisedProducts = [
  {
    id: "p1",
    title: "iPhone 14 Pro Max - Space Black",
    category: "Smartphones",
    originalPrice: 120000,
    resalePrice: 85000,
    yearsOfUse: "1.2 Years",
    image: "https://images.unsplash.com/photo-1678652197831-2d180705cd2c?q=80&w=600&auto=format&fit=crop",
    seller: "Arafat Codes",
    condition: "Excellent"
  },
  {
    id: "p2",
    title: "MacBook Air M2 - 8GB/256GB",
    category: "Laptops",
    originalPrice: 135000,
    resalePrice: 98000,
    yearsOfUse: "8 Months",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop",
    seller: "Rahat Tech",
    condition: "Like New"
  }
];

export default function HomePage() {
  return (
    <div className="bg-[#0f172a] text-slate-100 min-h-screen font-sans overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
        <div className="absolute inset-0 -z-10 flex items-center justify-center">
          <div className="w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse"></div>
          <div className="w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[100px] delay-75"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center space-x-2 bg-slate-800/80 border border-slate-700 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-[#06b6d4] uppercase mb-6 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 animate-spin" />
            <span>Your Trusted Pre-Owned Marketplace</span>
          </span>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
            Gently Used Tech, <br />
            <span className="bg-gradient-to-r from-[#059669] via-[#06b6d4] to-blue-500 bg-clip-text text-transparent">
              Unbeatable Prices.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Buy and sell certified pre-owned smartphones, laptops, and gadgets with secure verified user accounts. Zero hidden costs, pure transparency.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto bg-gradient-to-r from-[#059669] to-[#06b6d4] text-slate-900 font-bold px-8 py-4 rounded-xl flex items-center justify-center space-x-2 shadow-xl shadow-cyan-500/10 tracking-wide transition-all"
              >
                <span>Explore Products</span>
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </Link>
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "#1e293b" }}
                className="w-full sm:w-auto bg-slate-800/50 border border-slate-700 text-slate-200 font-semibold px-8 py-4 rounded-xl transition-colors"
              >
                Sell Your Gadget
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* 2. CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800/60">
        <div className="text-center md:text-left mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Browse Categories</h2>
          <p className="text-slate-400 text-sm mt-1">Select a category to view tailored pre-owned tech listings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <Link href={`/category/${cat.name.toLowerCase()}`} key={cat.id}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className={`bg-gradient-to-br ${cat.color} border border-slate-800 p-6 rounded-2xl flex items-center space-x-5 cursor-pointer transition-all duration-300 backdrop-blur-sm ${cat.border}`}
                >
                  <div className="bg-slate-900 p-4 rounded-xl text-[#06b6d4] border border-slate-700">
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-100">{cat.name}</h3>
                    <span className="text-xs text-slate-400 font-medium block mt-0.5">{cat.count}</span>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. ADVERTISED ITEMS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800/60 pb-28">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 text-center md:text-left">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center justify-center md:justify-start gap-2 text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-amber-400">
              <Zap className="h-6 w-6 text-amber-400 fill-amber-400 animate-bounce" />
              <span>Premium Featured Deals</span>
            </h2>
            <p className="text-slate-400 text-sm mt-1">Top verified products prioritized by our trusted sellers</p>
          </div>
          <Link href="/products" className="mt-4 md:mt-0 text-sm font-bold text-[#06b6d4] hover:underline flex items-center justify-center gap-1">
            <span>View All Products</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {advertisedProducts.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ scale: 1.01 }}
              className="bg-[#1e293b]/40 border border-slate-800 rounded-3xl p-5 flex flex-col sm:flex-row gap-5 backdrop-blur-md relative overflow-hidden group hover:border-slate-700 transition-colors"
            >
              {/* Product Badge */}
              <span className="absolute top-3 right-3 text-[10px] uppercase tracking-widest font-extrabold bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-full backdrop-blur-sm">
                Advertised
              </span>

              {/* Image box */}
              <div className="w-full sm:w-44 h-44 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 relative flex-shrink-0">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Content box */}
              <div className="flex flex-col justify-between flex-grow">
                <div>
                  <span className="text-[11px] font-bold text-[#06b6d4] tracking-wider uppercase">{product.category}</span>
                  <h3 className="text-lg font-bold text-slate-100 mt-1 leading-snug group-hover:text-white transition-colors">{product.title}</h3>
                  
                  {/* Specifications row */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-slate-400 font-medium">
                    <p>Use: <span className="text-slate-200">{product.yearsOfUse}</span></p>
                    <p>Condition: <span className="text-emerald-400">{product.condition}</span></p>
                    <p>Seller: <span className="text-slate-300 font-semibold">{product.seller}</span></p>
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="flex items-center justify-between border-t border-slate-800/80 pt-4 mt-4 sm:mt-0">
                  <div>
                    <p className="text-xs text-slate-500 line-through">Original: ৳{product.originalPrice.toLocaleString()}</p>
                    <p className="text-xl font-black text-emerald-400 mt-0.5">৳{product.resalePrice.toLocaleString()}</p>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-slate-800 hover:bg-[#06b6d4] text-slate-300 hover:text-slate-900 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700 hover:border-[#06b6d4] transition-all flex items-center space-x-1"
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Book Now</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
