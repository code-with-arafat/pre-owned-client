"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingCart, PlusCircle, Package, Users, 
  LogOut, BarChart3, Upload, Trash2, ShoppingBag, Menu, X, Heart, CreditCard, User, CheckCircle, Clock
} from "lucide-react";
import api from "@/utils/api"; 

export default function DashboardPage() {
  const { user, logoutUser } = useAuth(); 
  const router = useRouter();
  
  const userRole = user?.role || "buyer"; 
  const [activeTab, setActiveTab] = useState("myOrders");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sync default tab whenever the user role updates or loads
  useEffect(() => {
    if (userRole === "admin") setActiveTab("adminOverview");
    else if (userRole === "seller") setActiveTab("listings");
    else setActiveTab("myOrders");
  }, [userRole]);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col md:flex-row">
      
      {/* MOBILE NAVBAR TOP BAR */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#1e293b] border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <Avatar user={user} className="w-8 h-8 text-xs" />
          <span className="text-sm font-bold truncate max-w-[120px]">
            {user?.displayName || "User"}
          </span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-slate-300 hover:text-white"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* SIDEBAR NAVIGATION */}
      <aside className={`
        w-full md:w-64 bg-[#1e293b]/50 backdrop-blur-md border-r border-slate-800 p-6 
        flex flex-col justify-between transition-all duration-300
        ${isMobileMenuOpen ? "block" : "hidden md:flex"}
      `}>
        <div>
          <div className="hidden md:flex items-center space-x-3 pb-6 border-b border-slate-800">
            <Avatar user={user} className="w-10 h-10 text-base" />
            <div>
              <h4 className="text-sm font-bold truncate max-w-[140px]">{user?.displayName || "User"}</h4>
              <span className="text-[10px] bg-cyan-500/10 text-[#06b6d4] border border-cyan-500/20 px-2 py-0.5 rounded-full uppercase font-black tracking-wider block mt-0.5 w-max">
                {userRole}
              </span>
            </div>
          </div>

          {/* DYNAMIC SIDEBAR LINKS */}
          <nav className="mt-4 md:mt-8 space-y-2">
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 px-3 mb-2">Main Menu</p>
            
            {userRole === "buyer" && (
              <>
                <SidebarItem icon={<ShoppingCart className="h-4 w-4" />} label="My Orders" active={activeTab === "myOrders"} onClick={() => { setActiveTab("myOrders"); setIsMobileMenuOpen(false); }} />
                <SidebarItem icon={<Heart className="h-4 w-4" />} label="Wishlist" active={activeTab === "wishlist"} onClick={() => { setActiveTab("wishlist"); setIsMobileMenuOpen(false); }} />
                <SidebarItem icon={<CreditCard className="h-4 w-4" />} label="Payment History" active={activeTab === "payments"} onClick={() => { setActiveTab("payments"); setIsMobileMenuOpen(false); }} />
                <SidebarItem icon={<User className="h-4 w-4" />} label="Profile Management" active={activeTab === "profile"} onClick={() => { setActiveTab("profile"); setIsMobileMenuOpen(false); }} />
              </>
            )}

            {userRole === "seller" && (
              <>
                <SidebarItem icon={<Package className="h-4 w-4" />} label="My Products" active={activeTab === "listings"} onClick={() => { setActiveTab("listings"); setIsMobileMenuOpen(false); }} />
                <SidebarItem icon={<PlusCircle className="h-4 w-4" />} label="Add Product" active={activeTab === "addProduct"} onClick={() => { setActiveTab("addProduct"); setIsMobileMenuOpen(false); }} />
                <SidebarItem icon={<ShoppingBag className="h-4 w-4" />} label="Manage Orders" active={activeTab === "manageOrders"} onClick={() => { setActiveTab("manageOrders"); setIsMobileMenuOpen(false); }} />
                <SidebarItem icon={<BarChart3 className="h-4 w-4" />} label="Sales Analytics" active={activeTab === "analytics"} onClick={() => { setActiveTab("analytics"); setIsMobileMenuOpen(false); }} />
              </>
            )}

            {userRole === "admin" && (
              <>
                <SidebarItem icon={<BarChart3 className="h-4 w-4" />} label="Overview & Analytics" active={activeTab === "adminOverview"} onClick={() => { setActiveTab("adminOverview"); setIsMobileMenuOpen(false); }} />
                <SidebarItem icon={<Users className="h-4 w-4" />} label="Manage Users" active={activeTab === "manageUsers"} onClick={() => { setActiveTab("manageUsers"); setIsMobileMenuOpen(false); }} />
                <SidebarItem icon={<Package className="h-4 w-4" />} label="Manage Products" active={activeTab === "manageProducts"} onClick={() => { setActiveTab("manageProducts"); setIsMobileMenuOpen(false); }} />
                <SidebarItem icon={<ShoppingBag className="h-4 w-4" />} label="Manage Orders" active={activeTab === "adminOrders"} onClick={() => { setActiveTab("adminOrders"); setIsMobileMenuOpen(false); }} />
              </>
            )}
          </nav>
        </div>

        <button 
          onClick={logoutUser} 
          className="flex items-center space-x-3 w-full px-4 py-3 text-rose-400 hover:bg-rose-950/20 text-sm font-semibold rounded-xl transition-colors mt-6 md:mt-auto cursor-pointer"
        >
          <LogOut className="h-4 w-4" /> <span>Logout</span>
        </button>
      </aside>

      {/* MAIN DASHBOARD CONTENT AREA */}
      <main className="flex-grow p-6 md:p-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800/60">
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              Dashboard Overview
            </h1>
            <p className="text-slate-400 text-xs md:text-sm mt-1">
              Manage your activity, listings, and platform metrics seamlessly.
            </p>
          </div>
        </div>

        <div className="mt-8">
          {userRole === "admin" && <AdminDashboard activeTab={activeTab} />}
          {userRole === "seller" && <SellerDashboard activeTab={activeTab} setActiveTab={setActiveTab} />}
          {userRole === "buyer" && <BuyerDashboard activeTab={activeTab} />}
        </div>
      </main>
    </div>
  );
}

/* ==========================================
   SHARED HELPERS & UI COMPONENTS
   ========================================== */
function Avatar({ user, className = "w-10 h-10" }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className={`${className} rounded-full bg-[#06b6d4]/20 border border-[#06b6d4] flex items-center justify-center font-bold text-[#06b6d4] overflow-hidden flex-shrink-0`}>
      {user?.photoURL && !imgError ? (
        <img 
          src={user.photoURL} 
          alt={user?.displayName || "User"} 
          className="w-full h-full object-cover" 
          onError={() => setImgError(true)}
        />
      ) : (
        user?.displayName?.charAt(0).toUpperCase() || "U"
      )}
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center space-x-3 w-full px-4 py-3 font-semibold text-sm rounded-xl border transition-all cursor-pointer ${
        active 
        ? "bg-[#06b6d4]/10 text-[#06b6d4] border-[#06b6d4]/20" 
        : "text-slate-400 border-transparent hover:bg-slate-800/50 hover:text-white"
      }`}
    >
      {icon} <span>{label}</span>
    </button>
  );
}

function StatusBadge({ status }) {
  const formattedStatus = (status || "Processing").toLowerCase();
  
  const styles = {
    processing: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    shipped: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    delivered: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
  };

  return (
    <span className={`px-2.5 py-1 rounded-full border text-xs font-semibold capitalize ${styles[formattedStatus] || "bg-slate-800 text-cyan-400 border-cyan-500/20"}`}>
      {status || "Processing"}
    </span>
  );
}

/* ==========================================
   1. BUYER DASHBOARD COMPONENTS
   ========================================== */
function BuyerDashboard({ activeTab }) {
  const { user, updateUserProfile } = useAuth();
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [payments, setPayments] = useState([]);

  const [name, setName] = useState(user?.displayName || "");
  const [photo, setPhoto] = useState(user?.photoURL || "");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (user?.email) {
      setName(user.displayName || "");
      setPhoto(user.photoURL || "");

      api.get(`/orders/buyer/${encodeURIComponent(user.email)}`)
        .then(res => setOrders(res.data || []))
        .catch(() => setOrders([]));

      api.get(`/payments?email=${encodeURIComponent(user.email)}`)
        .then(res => setPayments(res.data || []))
        .catch(() => setPayments([]));

      api.get(`/wishlist/${encodeURIComponent(user.email)}`)
        .then(res => setWishlist(res.data || []))
        .catch(() => setWishlist([]));
    }
  }, [user?.email, user?.displayName, user?.photoURL]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await api.patch(`/users/${encodeURIComponent(user.email)}`, {
        displayName: name,
        photoURL: photo
      });

      if (updateUserProfile) {
        await updateUserProfile(name, photo);
      }

      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveWishlist = async (id) => {
    try {
      await api.delete(`/wishlist/${id}`);
      setWishlist(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      alert("Failed to remove item from wishlist.");
    }
  };

  return (
    <div className="space-y-6">
      {activeTab === "myOrders" && (
        <div className="bg-[#1e293b]/40 border border-slate-800 p-6 rounded-2xl">
          <h3 className="font-bold text-lg mb-4">My Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase">
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {orders.length === 0 ? (
                  <tr><td colSpan="3" className="text-center py-6 text-slate-500">No orders placed yet.</td></tr>
                ) : (
                  orders.map(ord => (
                    <tr key={ord._id}>
                      <td className="py-3 px-4 font-semibold">{ord.productTitle || ord.title}</td>
                      <td className="py-3 px-4 text-[#06b6d4]">৳{ord.amount || ord.price}</td>
                      <td className="py-3 px-4">
                        <StatusBadge status={ord.orderStatus || ord.status} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "wishlist" && (
        <div className="bg-[#1e293b]/40 border border-slate-800 p-6 rounded-2xl">
          <h3 className="font-bold text-lg mb-4">My Wishlist</h3>
          {wishlist.length === 0 ? (
            <p className="text-slate-500 text-sm">Your wishlist is empty.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {wishlist.map(item => (
                <div key={item._id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-sm">{item.productTitle || item.title}</h4>
                    <p className="text-[#06b6d4] text-xs font-bold mt-1">৳{item.price}</p>
                  </div>
                  <button onClick={() => handleRemoveWishlist(item._id)} className="text-rose-400 hover:bg-rose-500/10 p-2 rounded-lg cursor-pointer">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "payments" && (
        <div className="bg-[#1e293b]/40 border border-slate-800 p-6 rounded-2xl">
          <h3 className="font-bold text-lg mb-4">Payment History</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase">
                  <th className="py-3 px-4">Transaction ID</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {payments.length === 0 ? (
                  <tr><td colSpan="3" className="text-center py-6 text-slate-500">No payment history found.</td></tr>
                ) : (
                  payments.map(pay => (
                    <tr key={pay._id}>
                      <td className="py-3 px-4 font-mono text-xs text-slate-400">{pay.transactionId || pay._id}</td>
                      <td className="py-3 px-4 text-[#06b6d4] font-bold">৳{pay.amount}</td>
                      <td className="py-3 px-4 text-xs text-slate-400">{pay.date ? new Date(pay.date).toLocaleDateString() : "N/A"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "profile" && (
        <div className="bg-[#1e293b]/40 border border-slate-800 p-6 rounded-2xl max-w-xl">
          <h3 className="font-bold text-lg mb-4">Profile Management</h3>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1 font-semibold">Display Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#06b6d4]" 
                placeholder="Enter display name"
                required
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1 font-semibold">Profile Picture URL</label>
              <input 
                type="url" 
                value={photo} 
                onChange={(e) => setPhoto(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#06b6d4]" 
                placeholder="https://example.com/photo.jpg"
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={isUpdating}
              className="bg-[#06b6d4] hover:bg-cyan-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

/* ==========================================
   2. SELLER DASHBOARD COMPONENTS
   ========================================== */
function SellerDashboard({ activeTab, setActiveTab }) {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user?.email) {
      api.get(`/products/seller/${encodeURIComponent(user.email)}`)
        .then(res => setProducts(res.data || []))
        .catch(() => setProducts([]));

      api.get(`/orders/seller/${encodeURIComponent(user.email)}`)
        .then(res => setOrders(res.data || []))
        .catch(() => setOrders([]));
    }
  }, [user?.email]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/${orderId}`, { status: newStatus });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-[#1e293b]/40 border border-slate-800 p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-bold uppercase">Total Products</span>
          <h2 className="text-3xl font-black text-emerald-400 mt-1">{products.length}</h2>
        </div>
        <div className="bg-[#1e293b]/40 border border-slate-800 p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-bold uppercase">Total Orders</span>
          <h2 className="text-3xl font-black text-cyan-400 mt-1">{orders.length}</h2>
        </div>
        <div className="bg-[#1e293b]/40 border border-slate-800 p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-bold uppercase">Revenue</span>
          <h2 className="text-3xl font-black text-indigo-400 mt-1">
            ৳{orders.reduce((sum, o) => sum + (o.amount || o.price || 0), 0)}
          </h2>
        </div>
        <div className="bg-[#1e293b]/40 border border-slate-800 p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-bold uppercase">Pending Orders</span>
          <h2 className="text-3xl font-black text-amber-400 mt-1">
            {orders.filter(o => (o.orderStatus || o.status)?.toLowerCase() === "processing").length}
          </h2>
        </div>
      </div>

      {activeTab === "listings" && <SellerProductList products={products} setProducts={setProducts} />}
      {activeTab === "addProduct" && <AddProductForm onSuccess={() => setActiveTab("listings")} />}
      
      {activeTab === "manageOrders" && (
        <div className="bg-[#1e293b]/40 border border-slate-800 p-6 rounded-2xl">
          <h3 className="font-bold text-lg mb-4">Manage Orders & Delivery Status</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase">
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Buyer Email</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Delivery Stage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {orders.length === 0 ? (
                  <tr><td colSpan="4" className="text-center py-6 text-slate-500">No orders placed yet.</td></tr>
                ) : (
                  orders.map(ord => (
                    <tr key={ord._id}>
                      <td className="py-3 px-4 font-semibold">{ord.productTitle || ord.title}</td>
                      <td className="py-3 px-4 text-slate-400">{ord.buyerInfo?.email || ord.email}</td>
                      <td className="py-3 px-4 text-[#06b6d4]">৳{ord.amount || ord.price}</td>
                      <td className="py-3 px-4">
                        <select 
                          value={ord.orderStatus || ord.status || "processing"} 
                          onChange={(e) => updateOrderStatus(ord._id, e.target.value)}
                          className="bg-slate-900 border border-slate-800 text-xs rounded-lg px-3 py-1.5 text-slate-200 capitalize focus:outline-none focus:border-[#06b6d4]"
                        >
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="bg-[#1e293b]/40 border border-slate-800 p-6 rounded-2xl">
          <h3 className="font-bold text-lg mb-4">Sales Analytics & Charts</h3>
          <div className="h-64 flex items-center justify-center border border-dashed border-slate-800 rounded-xl text-slate-500">
            📊 Sales Bar/Line Chart Visualizer
          </div>
        </div>
      )}
    </div>
  );
}

function SellerProductList({ products, setProducts }) {
  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/${id}`);
        setProducts(prev => prev.filter(p => p._id !== id));
      } catch (err) {
        alert("Failed to delete product.");
      }
    }
  };

  return (
    <div className="bg-[#1e293b]/40 border border-slate-800 p-6 rounded-2xl">
      <h3 className="font-bold text-lg mb-4">My Products</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase">
              <th className="py-3 px-4">Product</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {products.length === 0 ? (
              <tr><td colSpan="4" className="text-center py-6 text-slate-500">No products found.</td></tr>
            ) : (
              products.map(p => (
                <tr key={p._id}>
                  <td className="py-3 px-4 font-semibold">{p.title || p.name}</td>
                  <td className="py-3 px-4 text-slate-400 capitalize">{p.category}</td>
                  <td className="py-3 px-4 text-[#06b6d4]">৳{p.price}</td>
                  <td className="py-3 px-4 text-center">
                    <button onClick={() => handleDelete(p._id)} className="text-rose-400 p-1.5 hover:bg-rose-500/10 rounded-lg cursor-pointer">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ==========================================
   3. ADMIN DASHBOARD COMPONENTS
   ========================================== */
function AdminDashboard({ activeTab }) {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/users").then(res => setUsers(res.data || [])).catch(() => {});
    api.get("/products").then(res => setProducts(res.data?.products || res.data || [])).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[#1e293b]/40 border border-slate-800 p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-bold uppercase">Total Users</span>
          <h2 className="text-3xl font-black text-indigo-400 mt-1">{users.length}</h2>
        </div>
        <div className="bg-[#1e293b]/40 border border-slate-800 p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-bold uppercase">Total Products</span>
          <h2 className="text-3xl font-black text-emerald-400 mt-1">{products.length}</h2>
        </div>
      </div>

      {activeTab === "adminOverview" && (
        <div className="bg-[#1e293b]/40 border border-slate-800 p-6 rounded-2xl">
          <h3 className="font-bold text-lg mb-2">Platform Control & Analytics</h3>
          <p className="text-sm text-slate-400">Monitor all systemic transactions and activities from the dedicated control center tabs.</p>
        </div>
      )}

      {activeTab === "manageUsers" && (
        <div className="bg-[#1e293b]/40 border border-slate-800 p-6 rounded-2xl">
          <h3 className="font-bold text-lg mb-4">Manage Users</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase">
                  <th className="py-3 px-4">Name & Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {users.map(u => (
                  <tr key={u._id}>
                    <td className="py-3 px-4">
                      <p className="font-semibold">{u.name || u.displayName}</p>
                      <p className="text-xs text-slate-400">{u.email}</p>
                    </td>
                    <td className="py-3 px-4 uppercase text-xs">{u.role}</td>
                    <td className="py-3 px-4 text-center">
                      <button onClick={() => alert("User status updated")} className="text-xs bg-slate-800 px-3 py-1 rounded-lg text-rose-400 hover:bg-slate-700 cursor-pointer">Block</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================
   4. ADD PRODUCT FORM COMPONENT
   ========================================== */
function AddProductForm({ onSuccess }) {
  const { user } = useAuth(); 
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "", category: "smartphones", condition: "excellent",
    resalePrice: "", originalPrice: "", yearsOfUse: "",
    location: "", phone: "", image: "", description: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post("/products", {
        title: formData.name, category: formData.category, condition: formData.condition,
        price: parseFloat(formData.resalePrice), originalPrice: parseFloat(formData.originalPrice),
        yearsOfUse: formData.yearsOfUse, location: formData.location, phone: formData.phone,
        images: [formData.image], description: formData.description,
        sellerInfo: { email: user?.email, name: user?.displayName }, status: "available"
      });
      alert("Product added successfully!");
      onSuccess();
    } catch (err) {
      alert("Failed to add product.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#1e293b]/40 border border-slate-800 p-6 rounded-3xl max-w-3xl">
      <h2 className="text-xl font-bold mb-4">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="text" placeholder="Product Name" required
          className="w-full bg-slate-900 border border-slate-800 px-4 py-3 rounded-xl text-sm text-white focus:outline-none focus:border-[#06b6d4]"
          value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
        />
        <div className="grid grid-cols-2 gap-4">
          <input 
            type="number" placeholder="Resale Price (৳)" required
            className="w-full bg-slate-900 border border-slate-800 px-4 py-3 rounded-xl text-sm text-white focus:outline-none focus:border-[#06b6d4]"
            value={formData.resalePrice} onChange={e => setFormData({...formData, resalePrice: e.target.value})}
          />
          <input 
            type="number" placeholder="Original Price (৳)" required
            className="w-full bg-slate-900 border border-slate-800 px-4 py-3 rounded-xl text-sm text-white focus:outline-none focus:border-[#06b6d4]"
            value={formData.originalPrice} onChange={e => setFormData({...formData, originalPrice: e.target.value})}
          />
        </div>
        <input 
          type="url" placeholder="Image URL" required
          className="w-full bg-slate-900 border border-slate-800 px-4 py-3 rounded-xl text-sm text-white focus:outline-none focus:border-[#06b6d4]"
          value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})}
        />
        <textarea 
          placeholder="Description" required rows={3}
          className="w-full bg-slate-900 border border-slate-800 px-4 py-3 rounded-xl text-sm text-white focus:outline-none focus:border-[#06b6d4]"
          value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
        />
        <button disabled={isLoading} className="w-full bg-[#06b6d4] text-slate-950 font-bold py-3 rounded-xl uppercase text-xs tracking-wider cursor-pointer disabled:opacity-50">
          {isLoading ? "Publishing..." : "Submit Product"}
        </button>
      </form>
    </div>
  );
}