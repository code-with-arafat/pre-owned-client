"use client";
import { useAuth } from "@/context/AuthContext";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  User, ShoppingCart, PlusCircle, Package, Users, 
  AlertTriangle, Settings, LogOut, BarChart3 
} from "lucide-react";

export default function DashboardPage() {
  const { user, logoutUser } = useAuth();
  const router = useRouter();
  
  
  // আপাতত ডাটাবেজ না থাকা পর্যন্ত আমরা টেস্ট করার জন্য রোল 'admin' বা 'seller' ধরে নিচ্ছি
  const userRole = user?.role || "buyer";

  // প্রোটেকটেড রাউট গার্ড: লগইন না থাকলে হোমে পাঠিয়ে দেবে
  useEffect(() => {
    if (!user) {
      // router.push("/login"); // টেস্টিং শেষ হলে এটি আনকমেন্ট করবেন
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col md:flex-row">
      
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-[#1e293b]/50 backdrop-blur-md border-r border-slate-800 p-6 flex flex-col justify-between hidden md:flex">
        <div>
          {/* User Profile Summary */}
          <div className="flex items-center space-x-3 pb-6 border-b border-slate-800">
            <div className="w-10 h-10 rounded-full bg-[#06b6d4]/20 border border-[#06b6d4] flex items-center justify-center font-bold text-[#06b6d4]">
              {user?.displayName?.charAt(0) || "A"}
            </div>
            <div>
              <h4 className="text-sm font-bold truncate max-w-[140px]">{user?.displayName || "Arafat Codes"}</h4>
              <span className="text-[10px] bg-cyan-500/10 text-[#06b6d4] border border-cyan-500/20 px-2 py-0.5 rounded-full uppercase font-black tracking-wider block mt-0.5 w-max">
                {userRole}
              </span>
            </div>
          </div>

          {/* DYNAMIC SIDEBAR LINKS BASED ON ROLE */}
          <nav className="mt-8 space-y-2">
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 px-3 mb-2">Core Menu</p>
            
            {/* ১. BUYER MENU */}
            {userRole === "buyer" && (
              <>
                <button className="flex items-center space-x-3 w-full px-4 py-3 bg-[#06b6d4]/10 text-[#06b6d4] font-semibold text-sm rounded-xl border border-[#06b6d4]/20">
                  <ShoppingCart className="h-4 w-4" /> <span>My Orders</span>
                </button>
                <button className="flex items-center space-x-3 w-full px-4 py-3 text-slate-400 hover:text-white text-sm rounded-xl hover:bg-slate-800/50 transition-colors">
                  <User className="h-4 w-4" /> <span>My Wishlist</span>
                </button>
              </>
            )}

            {/* ২. SELLER MENU */}
            {userRole === "seller" && (
              <>
                <button className="flex items-center space-x-3 w-full px-4 py-3 bg-[#059669]/10 text-[#10b981] font-semibold text-sm rounded-xl border border-[#059669]/20">
                  <Package className="h-4 w-4" /> <span>My Products</span>
                </button>
                <button className="flex items-center space-x-3 w-full px-4 py-3 text-slate-400 hover:text-white text-sm rounded-xl hover:bg-slate-800/50 transition-colors">
                  <PlusCircle className="h-4 w-4" /> <span>Add New Product</span>
                </button>
              </>
            )}

            {/* ৩. ADMIN MENU */}
            {userRole === "admin" && (
              <>
                <button className="flex items-center space-x-3 w-full px-4 py-3 bg-indigo-500/10 text-indigo-400 font-semibold text-sm rounded-xl border border-indigo-500/20">
                  <BarChart3 className="h-4 w-4" /> <span>Overview</span>
                </button>
                <button className="flex items-center space-x-3 w-full px-4 py-3 text-slate-400 hover:text-white text-sm rounded-xl hover:bg-slate-800/50 transition-colors">
                  <Users className="h-4 w-4" /> <span>Manage Users</span>
                </button>
                <button className="flex items-center space-x-3 w-full px-4 py-3 text-slate-400 hover:text-white text-sm rounded-xl hover:bg-slate-800/50 transition-colors">
                  <AlertTriangle className="h-4 w-4" /> <span>Reported Items</span>
                </button>
              </>
            )}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <button onClick={logoutUser} className="flex items-center space-x-3 w-full px-4 py-3 text-rose-400 hover:bg-rose-950/20 text-sm font-semibold rounded-xl transition-colors mt-auto">
          <LogOut className="h-4 w-4" /> <span>Logout</span>
        </button>
      </aside>

      {/* MAIN DASHBOARD CONTENT AREA */}
      <main className="flex-grow p-6 md:p-10">
        {/* Dynamic Welcoming Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800/60">
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">Welcome Back, {user?.displayName || "Developer"}!</h1>
            <p className="text-slate-400 text-xs md:text-sm mt-1">Here is what's happening with your PreOwned account panel.</p>
          </div>
          <div className="mt-4 md:mt-0 text-xs bg-slate-800 px-4 py-2 rounded-xl border border-slate-700 text-slate-300">
            System Date: <span className="text-[#06b6d4] font-mono">June 2026</span>
          </div>
        </div>

        {/* DYNAMIC CONTENT SWITCHER COMPONENT */}
        <div className="mt-8">
          {userRole === "buyer" && <BuyerPanel />}
          {userRole === "seller" && <SellerPanel />}
          {userRole === "admin" && <AdminPanel />}
        </div>
      </main>
    </div>
  );
}

/* ==========================================
   SUB-PANELS (এগুলো আলাদা ফাইলে না নিয়ে এখানেই রাখলাম কোড সহজ করতে)
   ========================================== */

// ১. Buyer View
function BuyerPanel() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-[#1e293b]/40 border border-slate-800 p-6 rounded-2xl backdrop-blur-sm">
        <h3 className="font-bold text-lg mb-3 text-slate-200">My Booked Orders</h3>
        <p className="text-slate-400 text-sm">You haven't booked any second-hand gadgets yet. Go to the products page to lock your first deal!</p>
      </div>
    </motion.div>
  );
}

// ২. Seller View
function SellerPanel() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-500/10 to-transparent border border-slate-800 p-5 rounded-2xl text-center">
          <span className="text-xs text-slate-400 font-semibold uppercase">Products Listed</span>
          <h2 className="text-3xl font-black text-emerald-400 mt-1">02</h2>
        </div>
        <div className="bg-gradient-to-br from-cyan-500/10 to-transparent border border-slate-800 p-5 rounded-2xl text-center">
          <span className="text-xs text-slate-400 font-semibold uppercase">Items Sold</span>
          <h2 className="text-3xl font-black text-cyan-400 mt-1">00</h2>
        </div>
      </div>
      <div className="bg-[#1e293b]/40 border border-slate-800 p-6 rounded-2xl backdrop-blur-sm">
        <h3 className="font-bold text-lg mb-2 text-slate-200">Active Product Listings</h3>
        <p className="text-slate-400 text-sm">Your active listings (iPhone 14 Pro, MacBook Air) are live and running in the advertisement loop.</p>
      </div>
    </motion.div>
  );
}

// ৩. Admin View
function AdminPanel() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-800/40 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs text-slate-400 font-bold uppercase">Total Sellers</p>
          <h2 className="text-3xl font-black text-indigo-400 mt-1">14+</h2>
        </div>
        <div className="bg-slate-800/40 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs text-slate-400 font-bold uppercase">Total Buyers</p>
          <h2 className="text-3xl font-black text-teal-400 mt-1">180+</h2>
        </div>
        <div className="bg-slate-800/40 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs text-slate-400 font-bold uppercase">Reports Received</p>
          <h2 className="text-3xl font-black text-rose-400 mt-1">00</h2>
        </div>
      </div>
    </motion.div>
  );
}