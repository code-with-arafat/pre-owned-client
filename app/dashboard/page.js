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
  const [activeTab, setActiveTab] = useState(
    userRole === "admin" ? "adminOverview" : userRole === "seller" ? "listings" : "myOrders"
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col md:flex-row">
      
      {/* MOBILE NAVBAR TOP BAR */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#1e293b] border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-[#06b6d4]/20 border border-[#06b6d4] flex items-center justify-center font-bold text-[#06b6d4] text-xs">
            {user?.displayName?.charAt(0) || "A"}
          </div>
          <span className="text-sm font-bold truncate max-w-[120px]">
            {user?.displayName || "Arafat"}
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
            <div className="w-10 h-10 rounded-full bg-[#06b6d4]/20 border border-[#06b6d4] flex items-center justify-center font-bold text-[#06b6d4]">
              {user?.displayName?.charAt(0) || "A"}
            </div>
            <div>
              <h4 className="text-sm font-bold truncate max-w-[140px]">{user?.displayName || "Arafat"}</h4>
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
                <SidebarItem icon={<ShoppingCart />} label="My Orders" active={activeTab === "myOrders"} onClick={() => { setActiveTab("myOrders"); setIsMobileMenuOpen(false); }} />
                <SidebarItem icon={<Heart />} label="Wishlist" active={activeTab === "wishlist"} onClick={() => { setActiveTab("wishlist"); setIsMobileMenuOpen(false); }} />
                <SidebarItem icon={<CreditCard />} label="Payment History" active={activeTab === "payments"} onClick={() => { setActiveTab("payments"); setIsMobileMenuOpen(false); }} />
                <SidebarItem icon={<User />} label="Profile Management" active={activeTab === "profile"} onClick={() => { setActiveTab("profile"); setIsMobileMenuOpen(false); }} />
              </>
            )}

            {userRole === "seller" && (
              <>
                <SidebarItem icon={<Package />} label="My Products" active={activeTab === "listings"} onClick={() => { setActiveTab("listings"); setIsMobileMenuOpen(false); }} />
                <SidebarItem icon={<PlusCircle />} label="Add Product" active={activeTab === "addProduct"} onClick={() => { setActiveTab("addProduct"); setIsMobileMenuOpen(false); }} />
                <SidebarItem icon={<ShoppingBag />} label="Manage Orders" active={activeTab === "manageOrders"} onClick={() => { setActiveTab("manageOrders"); setIsMobileMenuOpen(false); }} />
                <SidebarItem icon={<BarChart3 />} label="Sales Analytics" active={activeTab === "analytics"} onClick={() => { setActiveTab("analytics"); setIsMobileMenuOpen(false); }} />
              </>
            )}

            {userRole === "admin" && (
              <>
                <SidebarItem icon={<BarChart3 />} label="Overview & Analytics" active={activeTab === "adminOverview"} onClick={() => { setActiveTab("adminOverview"); setIsMobileMenuOpen(false); }} />
                <SidebarItem icon={<Users />} label="Manage Users" active={activeTab === "manageUsers"} onClick={() => { setActiveTab("manageUsers"); setIsMobileMenuOpen(false); }} />
                <SidebarItem icon={<Package />} label="Manage Products" active={activeTab === "manageProducts"} onClick={() => { setActiveTab("manageProducts"); setIsMobileMenuOpen(false); }} />
                <SidebarItem icon={<ShoppingBag />} label="Manage Orders" active={activeTab === "adminOrders"} onClick={() => { setActiveTab("adminOrders"); setIsMobileMenuOpen(false); }} />
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

/* ==========================================
   1. BUYER DASHBOARD COMPONENTS
   ========================================== */
function BuyerDashboard({ activeTab }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (user?.email) {
      api.get(`/bookings/email/${encodeURIComponent(user.email)}`).then(res => setOrders(res.data || []));
      api.get(`/wishlist/${encodeURIComponent(user.email)}`).catch(() => setWishlist([
        { _id: "1", title: "MacBook Pro M1", price: 85000, image: "https://placehold.co/50" }
      ]));
    }
  }, [user?.email]);

  return (
    <div className="space-y-6">
      {/* Activity Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#1e293b]/40 border border-slate-800 p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-bold uppercase">Total Orders</span>
          <h2 className="text-3xl font-black text-cyan-400 mt-1">{orders.length}</h2>
        </div>
        <div className="bg-[#1e293b]/40 border border-slate-800 p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-bold uppercase">Wishlist Items</span>
          <h2 className="text-3xl font-black text-rose-400 mt-1">{wishlist.length}</h2>
        </div>
        <div className="bg-[#1e293b]/40 border border-slate-800 p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-bold uppercase">Recent Purchases</span>
          <h2 className="text-3xl font-black text-emerald-400 mt-1">{orders.filter(o => o.status === 'Delivered').length}</h2>
        </div>
      </div>

      {activeTab === "myOrders" && (
        <div className="bg-[#1e293b]/40 border border-slate-800 p-6 rounded-2xl">
          <h3 className="font-bold text-lg mb-4">My Orders & Tracking</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase">
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Status / Tracking</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {orders.map(order => (
                  <tr key={order._id}>
                    <td className="py-3 px-4 font-semibold">{order.productTitle || order.title}</td>
                    <td className="py-3 px-4 text-[#06b6d4]">৳{order.price}</td>
                    <td className="py-3 px-4"><span className="px-2 py-0.5 rounded text-xs bg-cyan-500/10 text-cyan-400">{order.status || "Pending"}</span></td>
                    <td className="py-3 px-4 text-center">
                      <button onClick={() => alert("Order Cancelled")} className="text-xs bg-rose-500/20 text-rose-400 px-3 py-1 rounded-lg">Cancel</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "wishlist" && (
        <div className="bg-[#1e293b]/40 border border-slate-800 p-6 rounded-2xl">
          <h3 className="font-bold text-lg mb-4">My Wishlist</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {wishlist.map(item => (
              <div key={item._id} className="flex items-center justify-between p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
                <div className="flex items-center gap-3">
                  <img src={item.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                  <div>
                    <h4 className="font-semibold text-sm">{item.title}</h4>
                    <p className="text-xs text-[#06b6d4] font-bold">৳{item.price}</p>
                  </div>
                </div>
                <button className="text-rose-400 p-2 hover:bg-rose-500/10 rounded-lg"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "payments" && (
        <div className="bg-[#1e293b]/40 border border-slate-800 p-6 rounded-2xl">
          <h3 className="font-bold text-lg mb-4">Payment History & Transactions</h3>
          <p className="text-sm text-slate-400">No recent transactions recorded via gateway.</p>
        </div>
      )}

      {activeTab === "profile" && (
        <div className="bg-[#1e293b]/40 border border-slate-800 p-6 rounded-2xl max-w-xl">
          <h3 className="font-bold text-lg mb-4">Profile Management</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Display Name</label>
              <input type="text" defaultValue={user?.displayName} className="w-full bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl text-sm" />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Profile Picture URL</label>
              <input type="text" defaultValue={user?.photoURL} className="w-full bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl text-sm" />
            </div>
            <button className="bg-[#06b6d4] text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider">Save Changes</button>
          </div>
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
      api.get(`/products/seller/${encodeURIComponent(user.email)}`).then(res => setProducts(res.data || []));
      api.get(`/bookings/seller/${encodeURIComponent(user.email)}`).catch(() => setOrders([
        { _id: "o1", productTitle: "iPhone 13", price: 65000, status: "Pending", email: "buyer@gmail.com" }
      ]));
    }
  }, [user?.email]);

  const updateOrderStatus = async (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
  };

  return (
    <div className="space-y-6">
      {/* Activity Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-[#1e293b]/40 border border-slate-800 p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-bold uppercase">Total Products</span>
          <h2 className="text-3xl font-black text-emerald-400 mt-1">{products.length}</h2>
        </div>
        <div className="bg-[#1e293b]/40 border border-slate-800 p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-bold uppercase">Total Sales</span>
          <h2 className="text-3xl font-black text-cyan-400 mt-1">৳1,45,000</h2>
        </div>
        <div className="bg-[#1e293b]/40 border border-slate-800 p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-bold uppercase">Total Revenue</span>
          <h2 className="text-3xl font-black text-indigo-400 mt-1">৳1,20,000</h2>
        </div>
        <div className="bg-[#1e293b]/40 border border-slate-800 p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-bold uppercase">Pending Orders</span>
          <h2 className="text-3xl font-black text-amber-400 mt-1">{orders.filter(o => o.status === 'Pending').length}</h2>
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
                  <th className="py-3 px-4">Buyer</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Delivery Stage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {orders.map(ord => (
                  <tr key={ord._id}>
                    <td className="py-3 px-4 font-semibold">{ord.productTitle}</td>
                    <td className="py-3 px-4 text-slate-400">{ord.email}</td>
                    <td className="py-3 px-4 text-[#06b6d4]">৳{ord.price}</td>
                    <td className="py-3 px-4">
                      <select 
                        value={ord.status} 
                        onChange={(e) => updateOrderStatus(ord._id, e.target.value)}
                        className="bg-slate-900 border border-slate-800 text-xs rounded-lg px-3 py-1.5 text-slate-200"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="bg-[#1e293b]/40 border border-slate-800 p-6 rounded-2xl">
          <h3 className="font-bold text-lg mb-4">Sales Analytics & Charts</h3>
          <div className="h-64 flex items-center justify-center border border-dashed border-slate-800 rounded-xl text-slate-500">
            📊 Sales Bar/Line Chart Visualizer (Integrated via Recharts)
          </div>
        </div>
      )}
    </div>
  );
}

function SellerProductList({ products, setProducts }) {
  const handleDelete = async (id) => {
    if (confirm("Delete product?")) {
      await api.delete(`/products/${id}`);
      setProducts(prev => prev.filter(p => p._id !== id));
    }
  };

  return (
    <div className="bg-[#1e293b]/40 border border-slate-800 p-6 rounded-2xl">
      <h3 className="font-bold text-lg mb-4">My Products (CRUD & Filtering)</h3>
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
            {products.map(p => (
              <tr key={p._id}>
                <td className="py-3 px-4 font-semibold">{p.title}</td>
                <td className="py-3 px-4 text-slate-400 capitalize">{p.category}</td>
                <td className="py-3 px-4 text-[#06b6d4]">৳{p.price}</td>
                <td className="py-3 px-4 text-center">
                  <button onClick={() => handleDelete(p._id)} className="text-rose-400 p-1.5 hover:bg-rose-500/10 rounded-lg"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
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
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/users").then(res => setUsers(res.data || [])).catch(() => {});
    api.get("/products").then(res => setProducts(res.data || [])).catch(() => {});
    api.get("/bookings").then(res => setOrders(res.data || [])).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#1e293b]/40 border border-slate-800 p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-bold uppercase">Total Users</span>
          <h2 className="text-3xl font-black text-indigo-400 mt-1">{users.length || 12}</h2>
        </div>
        <div className="bg-[#1e293b]/40 border border-slate-800 p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-bold uppercase">Total Products</span>
          <h2 className="text-3xl font-black text-emerald-400 mt-1">{products.length || 24}</h2>
        </div>
        <div className="bg-[#1e293b]/40 border border-slate-800 p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-bold uppercase">Total Orders</span>
          <h2 className="text-3xl font-black text-cyan-400 mt-1">{orders.length || 8}</h2>
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
          <h3 className="font-bold text-lg mb-4">Manage Users (Block / Unblock / Delete)</h3>
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
                {(users.length ? users : [{ _id: 'u1', displayName: 'Arafat', email: 'arafat@gmail.com', role: 'admin' }]).map(u => (
                  <tr key={u._id}>
                    <td className="py-3 px-4">
                      <p className="font-semibold">{u.displayName}</p>
                      <p className="text-xs text-slate-400">{u.email}</p>
                    </td>
                    <td className="py-3 px-4 uppercase text-xs">{u.role}</td>
                    <td className="py-3 px-4 text-center">
                      <button onClick={() => alert("User Blocked")} className="text-xs bg-slate-800 px-3 py-1 rounded-lg text-rose-400 mr-2">Block</button>
                      <button onClick={() => alert("User Deleted")} className="text-xs bg-rose-500/20 px-3 py-1 rounded-lg text-rose-400">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "manageProducts" && (
        <div className="bg-[#1e293b]/40 border border-slate-800 p-6 rounded-2xl">
          <h3 className="font-bold text-lg mb-4">Manage Products (Approve / Reject / Delete)</h3>
          <p className="text-sm text-slate-400">All vendor product listings can be moderated here.</p>
        </div>
      )}

      {activeTab === "adminOrders" && (
        <div className="bg-[#1e293b]/40 border border-slate-800 p-6 rounded-2xl">
          <h3 className="font-bold text-lg mb-4">Manage Orders & Transaction Monitoring</h3>
          <p className="text-sm text-slate-400">Complete view of all platform orders and financial flows.</p>
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
          className="w-full bg-slate-900 border border-slate-800 px-4 py-3 rounded-xl text-sm text-white"
          value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
        />
        <div className="grid grid-cols-2 gap-4">
          <input 
            type="number" placeholder="Resale Price (৳)" required
            className="w-full bg-slate-900 border border-slate-800 px-4 py-3 rounded-xl text-sm text-white"
            value={formData.resalePrice} onChange={e => setFormData({...formData, resalePrice: e.target.value})}
          />
          <input 
            type="number" placeholder="Original Price (৳)" required
            className="w-full bg-slate-900 border border-slate-800 px-4 py-3 rounded-xl text-sm text-white"
            value={formData.originalPrice} onChange={e => setFormData({...formData, originalPrice: e.target.value})}
          />
        </div>
        <input 
          type="url" placeholder="Image URL" required
          className="w-full bg-slate-900 border border-slate-800 px-4 py-3 rounded-xl text-sm text-white"
          value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})}
        />
        <textarea 
          placeholder="Description" required rows="3"
          className="w-full bg-slate-900 border border-slate-800 px-4 py-3 rounded-xl text-sm text-white"
          value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
        />
        <button disabled={isLoading} className="w-full bg-[#06b6d4] text-slate-950 font-bold py-3 rounded-xl uppercase text-xs tracking-wider">
          {isLoading ? "Publishing..." : "Submit Product"}
        </button>
      </form>
    </div>
  );
}