"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { X, ShieldCheck, Tag, User, Mail, Phone, MapPin } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function BookingModal({ product, onClose }) {
  const { user } = useAuth();
  const [phone, setPhone] = useState("");
  const [meetingLocation, setMeetingLocation] = useState("");

  if (!product) return null;

  const handleBookingSubmit = (e) => {
    e.preventDefault();

    // বুকিংয়ের সম্পূর্ণ ডাটা স্ট্রাকচার (পরবর্তীতে ডাটাবেজে যাবে)
    const bookingData = {
      bookingId: "b_" + Date.now(),
      productId: product.id,
      productName: product.title || product.name,
      price: product.resalePrice,
      image: product.image,
      buyerName: user?.displayName || "Anonymous Buyer",
      buyerEmail: user?.email || "no-email@test.com",
      buyerPhone: phone,
      meetingLocation: meetingLocation,
    };

    console.log("Booking Confirmed Data:", bookingData);
    alert(`🎉 Success! ${product.title || product.name} বুকিং কনফার্ম হয়েছে। (Console চেক করুন)`);
    onClose(); // মডাল বন্ধ করার জন্য
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 🟢 Backdrop Blur Overlay */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
      />

      {/* 📦 Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-md bg-[#1e293b]/90 border border-slate-800 p-6 rounded-3xl shadow-2xl shadow-cyan-500/5 backdrop-blur-xl z-10 overflow-hidden"
      >
        {/* Glow effect */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h3 className="text-lg font-bold flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">
            <ShieldCheck className="h-5 w-5 text-[#06b6d4]" />
            <span>Confirm Your Booking</span>
          </h3>
          <button 
            onClick={onClose}
            className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleBookingSubmit} className="mt-5 space-y-4">
          {/* Product Summary Item */}
          <div className="bg-slate-900/60 border border-slate-800/80 p-3 rounded-2xl flex items-center gap-3">
            <img src={product.image} alt={product.title} className="w-12 h-12 rounded-xl object-cover border border-slate-700 flex-shrink-0" />
            <div className="truncate">
              <h4 className="text-sm font-bold text-slate-200 truncate">{product.title || product.name}</h4>
              <p className="text-xs font-black text-emerald-400 mt-0.5 flex items-center gap-1">
                <Tag className="h-3 w-3" /> ৳{product.resalePrice?.toLocaleString()}
              </p>
            </div>
          </div>

          {/* User Name (Disabled/Auto-filled) */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Your Name</label>
            <div className="relative">
              <input 
                type="text" disabled
                value={user?.displayName || "Arafat Codes"}
                className="w-full bg-slate-900/50 border border-slate-800/60 px-4 py-2.5 pl-10 rounded-xl text-sm text-slate-400 cursor-not-allowed outline-none"
              />
              <User className="absolute left-3.5 top-3.5 h-3.5 w-3.5 text-slate-500" />
            </div>
          </div>

          {/* User Email (Disabled/Auto-filled) */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Your Email</label>
            <div className="relative">
              <input 
                type="email" disabled
                value={user?.email || "arafat@example.com"}
                className="w-full bg-slate-900/50 border border-slate-800/60 px-4 py-2.5 pl-10 rounded-xl text-sm text-slate-400 cursor-not-allowed outline-none"
              />
              <Mail className="absolute left-3.5 top-3.5 h-3.5 w-3.5 text-slate-500" />
            </div>
          </div>

          {/* Buyer Phone Number (Input Required) */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Phone Number</label>
            <div className="relative">
              <input 
                type="tel" required
                placeholder="e.g. 017XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-[#06b6d4] px-4 py-2.5 pl-10 rounded-xl text-sm text-white focus:outline-none transition-colors"
              />
              <Phone className="absolute left-3.5 top-3.5 h-3.5 w-3.5 text-slate-500" />
            </div>
          </div>

          {/* Meeting Location (Input Required) */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Meeting Location</label>
            <div className="relative">
              <input 
                type="text" required
                placeholder="e.g. New Market, Rajshahi"
                value={meetingLocation}
                onChange={(e) => setMeetingLocation(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-[#06b6d4] px-4 py-2.5 pl-10 rounded-xl text-sm text-white focus:outline-none transition-colors"
              />
              <MapPin className="absolute left-3.5 top-3.5 h-3.5 w-3.5 text-slate-500" />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-gradient-to-r from-[#059669] to-[#06b6d4] text-slate-900 font-extrabold py-3 rounded-xl uppercase tracking-widest text-xs shadow-lg shadow-cyan-500/10 transition-all"
            >
              Confirm Purchase
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}