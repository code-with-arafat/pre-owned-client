"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ShieldCheck, MapPin, Phone, User, Clock, Tag, 
  ArrowLeft, CheckCircle2, AlertCircle, Share2
} from "lucide-react";
import api from "@/utils/api";
import { useAuth } from "@/context/AuthContext";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔄 ডাটাবেজ থেকে নির্দিষ্ট প্রোডাক্টের ডেটা ফেচ করা
  useEffect(() => {
    if (!id) return;

    const fetchProductDetails = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/products/${id}`);
        if (response.data) {
          setProduct(response.data);
        } else {
          setError("Product details not found.");
        }
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError("Failed to load product details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  // 💳 পেমেন্ট/বুকিং পেজে নেভিগেট করার লজিক
  const handleBookNow = () => {
    if (!user) {
      alert("Please log in first to book a product!");
      router.push("/login");
      return;
    }
    router.push(`/dashboard/payment/${product._id}`);
  };

  // 🔗 শেয়ার লিংক কপি করার ফাংশন
  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      alert("Product link copied to clipboard!");
    }
  };

  // ⌛ লোডিং স্টেট
  if (isLoading) {
    return (
      <div className="bg-[#0f172a] min-h-screen text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
          <div className="h-6 bg-slate-800 rounded w-32" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="h-96 bg-slate-800/60 rounded-3xl" />
            <div className="space-y-4">
              <div className="h-8 bg-slate-800 rounded w-3/4" />
              <div className="h-6 bg-slate-800 rounded w-1/3" />
              <div className="h-24 bg-slate-800/40 rounded-2xl" />
              <div className="h-12 bg-slate-800 rounded-xl w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ❌ এরর স্টেট
  if (error || !product) {
    return (
      <div className="bg-[#0f172a] min-h-screen text-slate-100 flex items-center justify-center p-4">
        <div className="bg-[#1e293b]/60 border border-slate-800 rounded-3xl p-8 max-w-md text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold">{error || "Product not found"}</h2>
          <Link href="/products">
            <button className="bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold px-6 py-2.5 rounded-xl border border-slate-700 text-xs transition-all">
              Back to Products
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // ইমেজের অ্যারে প্রসেস করা
  const imageList = product.images && product.images.length > 0 
    ? product.images 
    : [product.image || "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=600"];

  return (
    <div className="bg-[#0f172a] text-slate-100 min-h-screen font-sans py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* BACK BUTTON & SHARE */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-cyan-400 bg-slate-900/60 border border-slate-800 px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Marketplace</span>
          </button>

          <button 
            onClick={handleShare}
            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-cyan-400" />
            <span>Share</span>
          </button>
        </div>

        {/* MAIN PRODUCT LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-[#1e293b]/40 border border-slate-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-md">
          
          {/* LEFT: IMAGE GALLERY */}
          <div className="space-y-4">
            {/* Main Image Display */}
            <div className="w-full h-80 sm:h-96 bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 relative group">
              <img 
                src={imageList[selectedImage]} 
                alt={product.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute top-4 left-4 text-[11px] uppercase font-black bg-slate-900/80 text-cyan-400 border border-slate-700 px-3 py-1 rounded-full backdrop-blur-md">
                {product.condition || "Used"}
              </span>
            </div>

            {/* Thumbnail Selection (If multiple images exist) */}
            {imageList.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {imageList.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                      selectedImage === idx ? "border-[#06b6d4] scale-95" : "border-slate-800 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: DETAILS & ACTIONS */}
          <div className="flex flex-col justify-between space-y-6">
            <div>
              {/* Category & Status */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-[#06b6d4] font-black uppercase tracking-widest bg-cyan-500/10 px-2.5 py-1 rounded-md border border-cyan-500/20">
                  {product.category}
                </span>
                <span className="text-[11px] text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 capitalize">
                  {product.status || "Available"}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{product.title}</h1>

              {/* Price Section */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-3xl font-black text-emerald-400">
                  ৳{(product.price || product.resalePrice || 0).toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-slate-500 line-through">
                    ৳{(product.originalPrice).toLocaleString()}
                  </span>
                )}
              </div>

              {/* Key Specs / Highlights */}
              <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-slate-800/80 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <Clock className="w-4 h-4 text-cyan-500" />
                  <span>Used: <strong>{product.yearsOfUse || "N/A"}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <MapPin className="w-4 h-4 text-cyan-500" />
                  <span>Location: <strong>{product.location || "Bangladesh"}</strong></span>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Product Description</h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed bg-slate-900/50 p-4 rounded-2xl border border-slate-800/60 whitespace-pre-line">
                  {product.description || "No description provided for this product."}
                </p>
              </div>

              {/* Seller Information */}
              <div className="mt-6 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Seller Details</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-200">
                    <User className="w-4 h-4 text-cyan-400" />
                    <span className="font-semibold">{product.sellerInfo?.name || "Verified Seller"}</span>
                  </div>
                  {product.phone && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <Phone className="w-4 h-4 text-emerald-400" />
                      <span>{product.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ACTION BUTTON */}
            <div className="pt-4 border-t border-slate-800/80">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBookNow}
                className="w-full bg-[#06b6d4] hover:bg-cyan-400 text-slate-950 font-black py-4 rounded-2xl shadow-lg shadow-cyan-500/10 flex items-center justify-center gap-2 text-sm uppercase tracking-wider transition-all cursor-pointer"
              >
                <ShieldCheck className="w-5 h-5" />
                <span>Book / Purchase Now</span>
              </motion.button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}