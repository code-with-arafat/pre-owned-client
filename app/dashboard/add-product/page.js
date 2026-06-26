"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PlusCircle, Image, Tag, Layers, Star, Info, CheckCircle2 } from "lucide-react";
import api from "@/utils/api";
import { useAuth } from "@/context/AuthContext";

export default function AddProductPage() {
  const { user } = useAuth(); // 👈 লগইন থাকা সেলারের ইনফো নেওয়ার জন্য
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // 📋 ফর্ম স্টেটস
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [condition, setCondition] = useState("Good");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccess(false);

    // 📦 সার্ভার রিকোয়ারমেন্ট অনুযায়ী অবজেক্ট স্ট্রাকচার
    const productData = {
      title,
      category,
      condition,
      price: parseFloat(price),
      images: [image], // সার্ভার array আশা করে
      description,
      sellerInfo: {
        userId: user?.uid || "seller_id_001",
        name: user?.displayName || "Anonymous Seller",
        email: user?.email
      }
    };

    try {
      // 🌐 আপনার ভার্সেল সার্ভারে সিকিউরলি ডাটা পাঠানো হচ্ছে
      const response = await api.post("/products", productData);
      if (response.data.insertedId) {
        setSuccess(true);
        // ফর্ম রিসেট করা
        setTitle("");
        setPrice("");
        setImage("");
        setDescription("");
      }
    } catch (error) {
      console.error("Error inserting product into MongoDB:", error);
      alert("Failed to sync with MongoDB server. Check JWT Token!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#0f172a] text-slate-100 min-h-screen p-4 sm:p-6 lg:p-8 flex justify-center items-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-[#1e293b]/40 border border-slate-800 p-6 sm:p-8 rounded-3xl backdrop-blur-md relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

        {/* HEADER */}
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-slate-100 flex items-center gap-2">
            <PlusCircle className="text-[#06b6d4] h-6 w-6" /> Add New Product Listing
          </h2>
          <p className="text-slate-400 text-xs mt-1">Fill out the credentials to push this pre-owned asset directly into MongoDB cluster.</p>
        </div>

        {/* SUCCESS NOTIFICATION */}
        <AnimatePresence>
          {success && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2.5 text-xs text-emerald-400 font-medium"
            >
              <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
              <span>Success! Product has been injected into 'resellHubDB.products' collection.</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FORM */}
        <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
          
          {/* Title */}
          <div>
            <label className="font-bold text-slate-400 uppercase tracking-wider block mb-1">Product Title</label>
            <input 
              type="text" required placeholder="e.g. Used Dell Inspiron 15 Laptop"
              value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 focus:border-[#06b6d4] px-4 py-2.5 rounded-xl text-white focus:outline-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="font-bold text-slate-400 uppercase tracking-wider block mb-1"><Layers className="inline w-3.5 h-3.5 mr-1" /> Category</label>
              <select 
                value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-[#06b6d4] px-4 py-2.5 rounded-xl text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Vehicles">Vehicles</option>
              </select>
            </div>

            {/* Condition */}
            <div>
              <label className="font-bold text-slate-400 uppercase tracking-wider block mb-1"><Star className="inline w-3.5 h-3.5 mr-1" /> Condition</label>
              <select 
                value={condition} onChange={(e) => setCondition(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-[#06b6d4] px-4 py-2.5 rounded-xl text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="Like New">Like New</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Price */}
            <div>
              <label className="font-bold text-slate-400 uppercase tracking-wider block mb-1"><Tag className="inline w-3.5 h-3.5 mr-1" /> Resale Price (BDT)</label>
              <input 
                type="number" required placeholder="e.g. 35000"
                value={price} onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-[#06b6d4] px-4 py-2.5 rounded-xl text-white focus:outline-none transition-colors"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="font-bold text-slate-400 uppercase tracking-wider block mb-1"><Image className="inline w-3.5 h-3.5 mr-1" /> Product Image URL</label>
              <input 
                type="url" required placeholder="https://images.unsplash.com/..."
                value={image} onChange={(e) => setImage(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-[#06b6d4] px-4 py-2.5 rounded-xl text-white focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="font-bold text-slate-400 uppercase tracking-wider block mb-1"><Info className="inline w-3.5 h-3.5 mr-1" /> Description & Specification</label>
            <textarea 
              rows="4" required placeholder="Describe item usage years, battery health, internal damage if any..."
              value={description} onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 focus:border-[#06b6d4] p-4 rounded-xl text-white focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* SUBMIT BUTTON */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-900 font-black py-3 rounded-xl uppercase tracking-widest shadow-md shadow-cyan-500/10 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                <span>Publishing to MongoDB Cluster...</span>
              </>
            ) : (
              <span>Publish Product</span>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}