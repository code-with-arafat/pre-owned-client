"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, ShoppingCart, PlusCircle, Package, Users, 
  AlertTriangle, LogOut, BarChart3, Upload, CheckCircle2, Trash2 
} from "lucide-react";
import api from "@/utils/api"; 

export default function DashboardPage() {
  const { user, logoutUser } = useAuth();
  const router = useRouter();
  
  const userRole = user?.role || "seller"; 
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
            
            {userRole === "buyer" && (
              <>
                <button className="flex items-center space-x-3 w-full px-4 py-3 bg-[#06b6d4]/10 text-[#06b6d4] font-semibold text-sm rounded-xl border border-[#06b6d4]/20">
                  <ShoppingCart className="h-4 w-4" /> <span>My Orders</span>
                </button>
              </>
            )}

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

        <button onClick={logoutUser} className="flex items-center space-x-3 w-full px-4 py-3 text-rose-400 hover:bg-rose-950/20 text-sm font-semibold rounded-xl transition-colors mt-auto">
          <LogOut className="h-4 w-4" /> <span>Logout</span>
        </button>
      </aside>

      {/* MAIN DASHBOARD CONTENT AREA */}
      <main className="flex-grow p-6 md:p-10">
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
   ADD PRODUCT FORM COMPONENT
   ========================================== */
function AddProductForm({ onSuccess }) {
  const { user } = useAuth(); 
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const productData = {
      title: formData.name, 
      category: formData.category,
      condition: formData.condition,
      price: parseFloat(formData.resalePrice), 
      originalPrice: parseFloat(formData.originalPrice),
      yearsOfUse: formData.yearsOfUse,
      location: formData.location,
      phone: formData.phone,
      images: [formData.image], 
      description: formData.description,
      sellerInfo: {
        userId: user?.uid || "seller_id_001",
        name: user?.displayName || "Anonymous Seller",
        email: user?.email
      },
      status: "available", 
      createdAt: new Date()
    };

    try {
      const response = await api.post("/products", productData);
      if (response.data.insertedId) {
        alert("🎉 Product Injected Successfully into 'resellHubDB.products' collection!");
        onSuccess(); 
      }
    } catch (error) {
      console.error("Error inserting product into MongoDB:", error);
      alert("Failed to sync with MongoDB server.");
    } finally {
      setIsLoading(false);
    }
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
          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Product Name</label>
            <input 
              type="text" required
              placeholder="e.g. iPhone 14 Pro Max - 256GB"
              className="w-full bg-slate-900 border border-slate-800 focus:border-[#06b6d4] px-4 py-3 rounded-xl text-sm focus:outline-none transition-colors text-white"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Category</label>
            <select 
              className="w-full bg-slate-900 border border-slate-800 focus:border-[#06b6d4] px-4 py-3 rounded-xl text-sm focus:outline-none transition-colors text-slate-300 cursor-pointer"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option value="smartphones">Smartphones</option>
              <option value="laptops">Laptops</option>
              <option value="smartwatches">Smartwatches</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Condition</label>
            <select 
              className="w-full bg-slate-900 border border-slate-800 focus:border-[#06b6d4] px-4 py-3 rounded-xl text-sm focus:outline-none transition-colors text-slate-300 cursor-pointer"
              value={formData.condition}
              onChange={(e) => setFormData({...formData, condition: e.target.value})}
            >
              <option value="excellent">Excellent (Like New)</option>
              <option value="good">Good (Minor Scratches)</option>
              <option value="fair">Fair (Visible signs of use)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Resale Price (৳)</label>
            <input 
              type="number" required
              placeholder="Asking price"
              className="w-full bg-slate-900 border border-slate-800 focus:border-[#06b6d4] px-4 py-3 rounded-xl text-sm focus:outline-none transition-colors text-white"
              value={formData.resalePrice}
              onChange={(e) => setFormData({...formData, resalePrice: e.target.value})}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Original Price (৳)</label>
            <input 
              type="number" required
              placeholder="Buying price"
              className="w-full bg-slate-900 border border-slate-800 focus:border-[#06b6d4] px-4 py-3 rounded-xl text-sm focus:outline-none transition-colors text-white"
              value={formData.originalPrice}
              onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Years/Months of Use</label>
            <input 
              type="text" required
              placeholder="e.g. 8 Months or 1.5 Years"
              className="w-full bg-slate-900 border border-slate-800 focus:border-[#06b6d4] px-4 py-3 rounded-xl text-sm focus:outline-none transition-colors text-white"
              value={formData.yearsOfUse}
              onChange={(e) => setFormData({...formData, yearsOfUse: e.target.value})}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Location</label>
            <input 
              type="text" required
              placeholder="e.g. Rajshahi, Dhaka"
              className="w-full bg-slate-900 border border-slate-800 focus:border-[#06b6d4] px-4 py-3 rounded-xl text-sm focus:outline-none transition-colors text-white"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Contact Number</label>
            <input 
              type="tel" required
              placeholder="e.g. 017XXXXXXXX"
              className="w-full bg-slate-900 border border-slate-800 focus:border-[#06b6d4] px-4 py-3 rounded-xl text-sm focus:outline-none transition-colors text-white"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Product Image URL</label>
            <div className="relative">
              <input 
                type="url" required
                placeholder="https://images.unsplash.com/... বা যেকোনো ইমেজের লিংক"
                className="w-full bg-slate-900 border border-slate-800 focus:border-[#06b6d4] pl-11 pr-4 py-3 rounded-xl text-sm focus:outline-none transition-colors text-white"
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
              />
              <Upload className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Description / Notes</label>
            <textarea 
              rows="4" required
              placeholder="প্রোডাক্টের কোনো স্ক্র্যাচ বা ইন্টারনাল প্রবলেম থাকলে..."
              className="w-full bg-slate-900 border border-slate-800 focus:border-[#06b6d4] px-4 py-3 rounded-xl text-sm focus:outline-none transition-colors resize-none text-white"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>
        </div>

        <div className="pt-4">
          <motion.button
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#059669] to-[#06b6d4] text-slate-900 font-bold py-3.5 rounded-xl uppercase tracking-widest text-xs shadow-lg shadow-cyan-500/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                <span>Publishing Item...</span>
              </>
            ) : (
              <span>Submit Listing</span>
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}

/* ==========================================
   🔄 SELLER PANEL COMPONENT (DYNAMICALLY UPDATED)
   ========================================== */
function SellerPanel() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // সেলারের ইমেইল অনুযায়ী ব্যাক-এন্ড থেকে প্রোডাক্ট ফেচ করা
  useEffect(() => {
    if (user?.email) {
      api.get(`/products/seller/${user?.email}`)
        .then(res => {
          setProducts(res.data);
          setIsLoading(false);
        })
        .catch(err => {
          console.error("Error loading products:", err);
          setIsLoading(false);
        });
    }
  }, [user?.email]);

  // প্রোডাক্ট ডিলিট হ্যান্ডলার (বোনাস ফিচার হিসেবে অ্যাড করে দিলাম)
  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this listing?")) {
      try {
        const response = await api.delete(`/products/${id}`);
        if (response.data.deletedCount > 0) {
          setProducts(products.filter(p => p._id !== id));
          alert("Product deleted successfully!");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  // 'sold' স্ট্যাটাসের প্রোডাক্ট কাউন্ট করার ক্যালকুলেশন
  const soldCount = products.filter(p => p.status === 'sold').length;

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 justify-center py-20 text-sm text-slate-400">
        <div className="w-5 h-5 border-2 border-[#06b6d4] border-t-transparent rounded-full animate-spin" />
        <span>Syncing server data...</span>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* 📊 TOP COUNTER STATS CARD */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-500/10 to-transparent border border-slate-800 p-5 rounded-2xl text-center">
          <span className="text-xs text-slate-400 font-semibold uppercase">Products Listed</span>
          {/* 💥 ডাইনামিক কাউন্ট বসানো হলো */}
          <h2 className="text-3xl font-black text-emerald-400 mt-1">
            {products.length < 10 ? `0${products.length}` : products.length}
          </h2>
        </div>
        <div className="bg-gradient-to-br from-cyan-500/10 to-transparent border border-slate-800 p-5 rounded-2xl text-center">
          <span className="text-xs text-slate-400 font-semibold uppercase">Items Sold</span>
          {/* 💥 বিক্রি হওয়া প্রোডাক্টের ডাইনামিক কাউন্ট */}
          <h2 className="text-3xl font-black text-cyan-400 mt-1">
            {soldCount < 10 ? `0${soldCount}` : soldCount}
          </h2>
        </div>
      </div>

      {/* 📦 ACTIVE PRODUCT LISTINGS TABLE */}
      <div className="bg-[#1e293b]/40 border border-slate-800 p-6 rounded-2xl backdrop-blur-sm">
        <h3 className="font-bold text-lg mb-4 text-slate-200">Active Product Listings</h3>
        
        {products.length === 0 ? (
          <p className="text-slate-400 text-sm">You haven't listed any items for resale yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price (৳)</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-800/50">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img 
                        src={product.images?.[0] || "https://placehold.co/50"} 
                        alt={product.title} 
                        className="w-10 h-10 object-cover rounded-lg border border-slate-700"
                      />
                      <span className="font-semibold truncate max-w-[180px]">{product.title}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 capitalize">{product.category}</td>
                    <td className="py-3 px-4 font-bold text-[#06b6d4]">{product.price}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        product.status === 'available' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button 
                        onClick={() => handleDelete(product._id)}
                        className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Delete Listing"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
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