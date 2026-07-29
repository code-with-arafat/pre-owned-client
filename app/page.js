"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Laptop, Smartphone, Watch, ArrowRight, Sparkles, ShieldCheck, Zap, AlertCircle,
  Car, Shirt, Armchair, Users, ShoppingBag, CheckCircle, Leaf, Recycle, Award, Star, Quote
} from "lucide-react";
import BookingModal from "@/components/BookingModal";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import api from "@/utils/api";

// 1. DYNAMIC CATEGORIES ACCORDING TO REQUIREMENTS
const categories = [
  { id: 1, name: "Electronics", icon: Laptop, count: "180+ Items", color: "from-cyan-500/20 to-blue-500/10", border: "hover:border-cyan-500/50" },
  { id: 2, name: "Mobile Phones", icon: Smartphone, count: "240+ Items", color: "from-emerald-500/20 to-teal-500/10", border: "hover:border-emerald-500/50" },
  { id: 3, name: "Furniture", icon: Armchair, count: "95+ Items", color: "from-amber-500/20 to-orange-500/10", border: "hover:border-amber-500/50" },
  { id: 4, name: "Vehicles", icon: Car, count: "60+ Items", color: "from-purple-500/20 to-indigo-500/10", border: "hover:border-purple-500/50" },
  { id: 5, name: "Fashion", icon: Shirt, count: "150+ Items", color: "from-pink-500/20 to-rose-500/10", border: "hover:border-pink-500/50" },
];

// SUCCESS STORIES DATA
const successStories = [
  {
    id: 1,
    name: "Tanvir Ahmed",
    role: "Verified Seller",
    story: "আমি আমার পুরনো ল্যাপটপটি মাত্র ২ দিনের মধ্যে ভালো দামে বিক্রি করতে পেরেছি। পেমেন্ট প্রসেস খুবই নিরাপদ ছিল।",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Sabrina Islam",
    role: "Happy Buyer",
    story: "একদম নতুন অবস্থার একটি iPhone ১৪ প্রসেসিং ফাস্ট ডেলিভারিসহ পেয়েছি। দাম বাজারমূল্যের চেয়ে অনেক কম ছিল!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop"
  }
];

// FRAMER MOTION VARIANTS
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

export default function HomePage() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [sellerAlert, setSellerAlert] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 1250,
    totalSellers: 420,
    totalBuyers: 3100,
    completedOrders: 980
  });
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  // FETCH FEATURED PRODUCTS & STATS FROM BACKEND
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch Featured Products
        const prodRes = await api.get('/products?size=6');
        if (prodRes.data && prodRes.data.products) {
          setFeaturedProducts(prodRes.data.products);
        }

        // Fetch Stats
        const statsRes = await api.get('/admin-stats');
        if (statsRes.data) {
          setStats({
            totalProducts: statsRes.data.totalProducts || 1250,
            totalSellers: statsRes.data.totalSellers || 420,
            totalBuyers: statsRes.data.totalBuyers || 3100,
            completedOrders: statsRes.data.totalOrders || 980
          });
        }
      } catch (error) {
        console.error("Failed to fetch homepage data, using fallback UI", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleBookingClick = (product) => {
    if (!user) {
      router.push("/login");
    } else {
      setSelectedProduct(product);
    }
  };

  const handleSellRedirect = async (e) => {
    e.preventDefault();
    if (!user) {
      router.push("/login");
      return;
    }

    try {
      const response = await api.get(`/users/role/${encodeURIComponent(user.email)}`);
      if (response.data && response.data.role === "seller") {
        router.push("/dashboard/add-product");
      } else {
        setSellerAlert(true);
      }
    } catch (error) {
      console.error("Error verifying seller account:", error);
      alert("Failed to verify your account role. Please try again.");
    }
  };

  return (
    <div className="bg-[#0f172a] text-slate-100 min-h-screen font-sans overflow-hidden">

      {/* 1. HERO BANNER SECTION */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-28">
        <div className="absolute inset-0 -z-10 flex items-center justify-center">
          <div className="w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[130px] animate-pulse"></div>
          <div className="w-[350px] h-[350px] bg-emerald-500/10 rounded-full blur-[110px] delay-100"></div>
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <span className="inline-flex items-center space-x-2 bg-slate-800/80 border border-slate-700 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-[#06b6d4] uppercase mb-6 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 animate-spin" />
            <span>Your Trusted Pre-Owned Marketplace</span>
          </span>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
            Gently Used Goods, <br />
            <span className="bg-gradient-to-r from-[#059669] via-[#06b6d4] to-blue-500 bg-clip-text text-transparent">
              Unbeatable Deals.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Buy and sell verified electronics, vehicles, fashion & furniture with total safety. Save money and make sustainable choices today.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto bg-gradient-to-r from-[#059669] to-[#06b6d4] text-slate-900 font-bold px-8 py-4 rounded-xl flex items-center justify-center space-x-2 shadow-xl shadow-cyan-500/10 tracking-wide transition-all cursor-pointer"
              >
                <span>Browse Marketplace</span>
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </Link>

            <button
              onClick={handleSellRedirect}
              className="w-full sm:w-auto bg-slate-800/60 border border-slate-700 hover:border-slate-600 text-slate-200 font-semibold px-8 py-4 rounded-xl transition-all cursor-pointer"
            >
              Sell An Item
            </button>
          </div>

          {/* Quick Hero Statistics */}
          <motion.div
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto bg-slate-900/60 p-6 rounded-2xl border border-slate-800/80 backdrop-blur-md"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <div>
              <h3 className="text-2xl font-black text-cyan-400">{stats.totalProducts}+</h3>
              <p className="text-xs text-slate-400 font-medium">Active Listings</p>
            </div>
            <div>
              <h3 className="text-2xl font-black text-emerald-400">{stats.completedOrders}+</h3>
              <p className="text-xs text-slate-400 font-medium">Successful Deals</p>
            </div>
            <div>
              <h3 className="text-2xl font-black text-amber-400">100%</h3>
              <p className="text-xs text-slate-400 font-medium">Verified Users</p>
            </div>
            <div>
              <h3 className="text-2xl font-black text-blue-400">4.9/5</h3>
              <p className="text-xs text-slate-400 font-medium">Community Rating</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* SELLER ALERT MODAL */}
      <AnimatePresence>
        {sellerAlert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-[#1e293b] border border-slate-800 p-8 rounded-3xl max-w-md w-full text-center shadow-2xl"
            >
              <div className="mx-auto bg-amber-500/10 w-16 h-16 flex items-center justify-center rounded-2xl border border-amber-500/20 mb-5">
                <AlertCircle className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-xl font-black text-white">Seller Account Required</h3>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                You are currently logged in as a Buyer. Please create or switch to a Seller account first to post your items for sale.
              </p>
              <div className="mt-7 flex justify-center gap-3">
                <button
                  onClick={() => setSellerAlert(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-6 py-3 rounded-xl transition-all cursor-pointer border border-slate-700"
                >
                  Understood
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. FEATURED PRODUCTS SECTION (DYNAMIC) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800/60">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 text-center md:text-left">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center justify-center md:justify-start gap-2">
              <Zap className="h-6 w-6 text-amber-400 fill-amber-400 animate-bounce" />
              <span>Featured Products</span>
            </h2>
            <p className="text-slate-400 text-sm mt-1">Explore top verified second-hand items added recently</p>
          </div>
          <Link href="/products" className="mt-4 md:mt-0 text-sm font-bold text-[#06b6d4] hover:underline flex items-center justify-center gap-1">
            <span>View All Products</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 bg-slate-800/40 rounded-2xl animate-pulse border border-slate-800"></div>
            ))}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {featuredProducts.map((product) => (
              <motion.div
                key={product._id || product.id}
                variants={fadeInUp}
                whileHover={{ y: -6 }}
                className="bg-[#1e293b]/40 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 flex flex-col justify-between backdrop-blur-md transition-all group"
              >
                <div>
                  <div className="w-full h-48 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 relative mb-4">
                    <img
                      src={
                        product.images?.[0] ||
                        product.image ||
                        product.productImage ||
                        "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=600&auto=format&fit=crop"
                      }
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <h3 className="text-lg font-bold text-slate-100 group-hover:text-cyan-400 transition-colors line-clamp-1">{product.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{product.description || "Certified pre-owned product in great condition."}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 line-through">৳{product.originalPrice || (product.price * 1.2)}</span>
                    <p className="text-xl font-black text-emerald-400">৳{product.price || product.resalePrice}</p>
                  </div>

                  <motion.button
                    onClick={() => handleBookingClick(product)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-slate-800 hover:bg-[#06b6d4] text-slate-300 hover:text-slate-900 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700 hover:border-[#06b6d4] transition-all flex items-center space-x-1 cursor-pointer"
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Book Now</span>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* 3. POPULAR CATEGORIES SECTION (DYNAMIC) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800/60">
        <div className="text-center md:text-left mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Popular Categories</h2>
          <p className="text-slate-400 text-sm mt-1">Explore pre-owned items across top market segments</p>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {categories.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <Link href={`/category/${cat.name.toLowerCase()}`} key={cat.id}>
                <motion.div
                  variants={fadeInUp}
                  whileHover={{ y: -5 }}
                  className={`bg-gradient-to-br ${cat.color} border border-slate-800 p-5 rounded-2xl flex flex-col items-center text-center space-y-3 cursor-pointer transition-all duration-300 backdrop-blur-sm ${cat.border}`}
                >
                  <div className="bg-slate-900 p-3.5 rounded-xl text-[#06b6d4] border border-slate-700">
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-100">{cat.name}</h3>
                    <span className="text-xs text-slate-400 font-medium block mt-1">{cat.count}</span>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </motion.div>
      </section>

      {/* 4. SUCCESS STORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800/60">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Success Stories</h2>
          <p className="text-slate-400 text-sm mt-1">Real experiences from our trusted buyers and sellers</p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {successStories.map((story) => (
            <motion.div
              key={story.id}
              variants={fadeInUp}
              className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(story.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm italic leading-relaxed">"{story.story}"</p>
              </div>

              <div className="flex items-center space-x-4 mt-6 pt-4 border-t border-slate-800">
                <img src={story.avatar} alt={story.name} className="w-12 h-12 rounded-full object-cover border border-slate-700" />
                <div>
                  <h4 className="font-bold text-slate-100 text-sm">{story.name}</h4>
                  <span className="text-xs text-cyan-400 font-medium">{story.role}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 5. MARKETPLACE STATISTICS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800/60">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800/80 to-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">Marketplace Impact & Stats</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto mb-10">Real-time stats from our growing ecosystem of second-hand traders.</p>

          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeInUp} className="flex flex-col items-center">
              <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl mb-3 border border-cyan-500/20">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-black text-white">{stats.totalProducts}+</h3>
              <p className="text-xs text-slate-400 mt-1">Total Products Listed</p>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex flex-col items-center">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl mb-3 border border-emerald-500/20">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-black text-white">{stats.totalSellers}+</h3>
              <p className="text-xs text-slate-400 mt-1">Verified Sellers</p>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex flex-col items-center">
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl mb-3 border border-amber-500/20">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-black text-white">{stats.totalBuyers}+</h3>
              <p className="text-xs text-slate-400 mt-1">Active Buyers</p>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex flex-col items-center">
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl mb-3 border border-blue-500/20">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-black text-white">{stats.completedOrders}+</h3>
              <p className="text-xs text-slate-400 mt-1">Completed Orders</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 6. EXTRA SECTION: SUSTAINABILITY IMPACT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800/60 pb-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/20 rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="max-w-xl text-center md:text-left">
            <span className="inline-flex items-center space-x-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold uppercase mb-4">
              <Leaf className="w-3.5 h-3.5" />
              <span>Eco-Friendly Choice</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              Reduce E-Waste & Protect The Planet Through Re-Use
            </h2>
            <p className="text-slate-400 text-sm mt-3 leading-relaxed">
              Every pre-owned item bought or sold prevents e-waste, lowers carbon emissions, and extends the lifespan of valuable resources. Make an impact with every deal.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
            <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 text-center">
              <Recycle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <h4 className="font-bold text-white text-lg">75%</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">E-Waste Saved</p>
            </div>
            <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 text-center">
              <Award className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <h4 className="font-bold text-white text-lg">100%</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Green Circularity</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* BOOKING MODAL */}
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