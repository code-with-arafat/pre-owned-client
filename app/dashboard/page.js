"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, ShoppingCart, PlusCircle, Package, Users, 
  AlertTriangle, LogOut, BarChart3, Upload, CheckCircle2 
} from "lucide-react";


export default function DashboardPage() {
  const { user, logoutUser } = useAuth();
  const router = useRouter();
  
  const userRole = user?.role || "seller"; 
  
  // সেলারের জন্য কোন ট্যাব অ্যাক্টিভ থাকবে তা ট্র্যাক করার স্টেট (listings অথবা addProduct)
  const [activeTab, setActiveTab] = useState("listings");

  useEffect(() => {
    if (!user) {
      // router.push("/login"); 
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
              </>
            )}

            {/* ২. SELLER MENU */}
            {userRole === "seller" && (
              <>
                <button 
                  onClick={() => setActiveTab("listings")}
                  className={`flex items-center space-x-3 w-full px-4 py-3 font-semibold text-sm rounded-xl border transition-all ${
                    activeTab === "listings" 
                    ? "bg-[#059669]/20 text-[#10b981] border-[#059669]/40" 
                    : "text-slate-400 border-transparent hover:bg-slate-800/50 hover:text-white"
                  }`}
                >
                  <Package className="h-4 w-4" /> <span>My Products</span>
                </button>
                <button 
                  onClick={() => setActiveTab("addProduct")}
                  className={`flex items-center space-x-3 w-full px-4 py-3 font-semibold text-sm rounded-xl border transition-all ${
                    activeTab === "addProduct" 
                    ? "bg-[#06b6d4]/20 text-[#06b6d4] border-[#06b6d4]/40" 
                    : "text-slate-400 border-transparent hover:bg-slate-800/50 hover:text-white"
                  }`}
                >
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
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800/60">
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">Welcome Back, {user?.displayName || "Developer"}!</h1>
            <p className="text-slate-400 text-xs md:text-sm mt-1">Here is what's happening with your PreOwned account panel.</p>
          </div>
        </div>

        {/* DYNAMIC CONTENT SWITCHER */}
        <div className="mt-8">
          {userRole === "buyer" && <BuyerPanel />}
          {userRole === "admin" && <AdminPanel />}
          
          {userRole === "seller" && (
            <AnimatePresence mode="wait">
              {activeTab === "listings" ? (
                <SellerPanel key="listings" />
              ) : (
                <AddProductForm key="addProduct" onSuccess={() => setActiveTab("listings")} />
              )}
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
}

/* ==========================================
   ADD PRODUCT FORM COMPONENT (NEW)
   ========================================== */
function AddProductForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "smartphones",
    condition: "excellent",
    resalePrice: "",
    originalPrice: "",
    yearsOfUse: "",
    location: "",
    phone: "",
    image: "",
    description: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Product Submitted successfully:", formData);
    alert("🎉 Product Added Successfully! (Console Check করুন)");
    onSuccess(); // ফর্ম সাবমিট হলে অটোমেটিক প্রোডাক্ট লিস্টিং ট্যাবে ব্যাক করবে
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-[#1e293b]/40 border border-slate-800 p-6 md:p-8 rounded-3xl backdrop-blur-md max-w-3xl"
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#06b6d4]">Add a New Product</h2>
        <p className="text-xs text-slate-400 mt-0.5">Fill out the form below to showcase your item in the marketplace.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Product Name */}
          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Product Name</label>
            <input 
              type="text" required
              placeholder="e.g. iPhone 14 Pro Max - 256GB"
              className="w-full bg-slate-900 border border-slate-800 focus:border-[#06b6d4] px-4 py-3 rounded-xl text-sm focus:outline-none transition-colors"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Category</label>
            <select 
              className="w-full bg-slate-900 border border-slate-800 focus:border-[#06b6d4] px-4 py-3 rounded-xl text-sm focus:outline-none transition-colors text-slate-300"
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option value="smartphones">Smartphones</option>
              <option value="laptops">Laptops</option>
              <option value="smartwatches">Smartwatches</option>
            </select>
          </div>

          {/* Condition Dropdown */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Condition</label>
            <select 
              className="w-full bg-slate-900 border border-slate-800 focus:border-[#06b6d4] px-4 py-3 rounded-xl text-sm focus:outline-none transition-colors text-slate-300"
              onChange={(e) => setFormData({...formData, condition: e.target.value})}
            >
              <option value="excellent">Excellent (Like New)</option>
              <option value="good">Good (Minor Scratches)</option>
              <option value="fair">Fair (Visible signs of use)</option>
            </select>
          </div>

          {/* Resale Price */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Resale Price (৳)</label>
            <input 
              type="number" required
              placeholder="Asking price"
              className="w-full bg-slate-900 border border-slate-800 focus:border-[#06b6d4] px-4 py-3 rounded-xl text-sm focus:outline-none transition-colors"
              onChange={(e) => setFormData({...formData, resalePrice: e.target.value})}
            />
          </div>

          {/* Original Price */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Original Price (৳)</label>
            <input 
              type="number" required
              placeholder="Buying price"
              className="w-full bg-slate-900 border border-slate-800 focus:border-[#06b6d4] px-4 py-3 rounded-xl text-sm focus:outline-none transition-colors"
              onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
            />
          </div>

          {/* Duration of Use */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Years/Months of Use</label>
            <input 
              type="text" required
              placeholder="e.g. 8 Months or 1.5 Years"
              className="w-full bg-slate-900 border border-slate-800 focus:border-[#06b6d4] px-4 py-3 rounded-xl text-sm focus:outline-none transition-colors"
              onChange={(e) => setFormData({...formData, yearsOfUse: e.target.value})}
            />
          </div>

          {/* Location */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Location</label>
            <input 
              type="text" required
              placeholder="e.g. Rajshahi, Dhaka"
              className="w-full bg-slate-900 border border-slate-800 focus:border-[#06b6d4] px-4 py-3 rounded-xl text-sm focus:outline-none transition-colors"
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
          </div>

          {/* Phone Number */}
          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Contact Number</label>
            <input 
              type="tel" required
              placeholder="e.g. 017XXXXXXXX"
              className="w-full bg-slate-900 border border-slate-800 focus:border-[#06b6d4] px-4 py-3 rounded-xl text-sm focus:outline-none transition-colors"
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>

          {/* Image URL Placeholder */}
          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Product Image URL</label>
            <div className="relative">
              <input 
                type="url" required
                placeholder="https://images.unsplash.com/... বা যেকোনো ইমেজের লিংক"
                className="w-full bg-slate-900 border border-slate-800 focus:border-[#06b6d4] pl-11 pr-4 py-3 rounded-xl text-sm focus:outline-none transition-colors"
                onChange={(e) => setFormData({...formData, image: e.target.value})}
              />
              <Upload className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />
            </div>
          </div>

          {/* Description */}
          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Description / Notes</label>
            <textarea 
              rows="4" required
              placeholder="প্রোডাক্টের কোনো স্ক্র্যাচ বা ইন্টারনাল প্রবলেম থাকলে এখানে উল্লেখ করুন..."
              className="w-full bg-slate-900 border border-slate-800 focus:border-[#06b6d4] px-4 py-3 rounded-xl text-sm focus:outline-none transition-colors resize-none"
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-gradient-to-r from-[#059669] to-[#06b6d4] text-slate-900 font-bold py-3.5 rounded-xl uppercase tracking-widest text-xs shadow-lg shadow-cyan-500/10 transition-all"
          >
            Submit Listing
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}

/* ==========================================
   REST OF SUB-PANELS (EXISTING)
   ========================================== */
function BuyerPanel() {
  return (
    <div className="bg-[#1e293b]/40 border border-slate-800 p-6 rounded-2xl backdrop-blur-sm">
      <h3 className="font-bold text-lg mb-3 text-slate-200">My Booked Orders</h3>
      <p className="text-slate-400 text-sm">You haven't booked any second-hand gadgets yet.</p>
    </div>
  );
}

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

function AdminPanel() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-slate-800/40 border border-slate-800 p-5 rounded-2xl">
        <p className="text-xs text-slate-400 font-bold uppercase">Total Sellers</p>
        <h2 className="text-3xl font-black text-indigo-400 mt-1">14+</h2>
      </div>
    </div>
  );
}