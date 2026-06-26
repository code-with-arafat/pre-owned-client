"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, LogOut, User, LayoutDashboard, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#1e293b]/90 backdrop-blur-md border-b border-slate-800 text-white sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* LOGO SECTION */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="bg-gradient-to-tr from-[#059669] to-[#06b6d4] p-2 rounded-xl group-hover:rotate-12 transition-transform">
                <ShoppingBag className="h-5 w-5 text-slate-900" />
              </div>
              <span className="font-black text-xl tracking-wider uppercase bg-gradient-to-r from-white to-[#06b6d4] bg-clip-text text-transparent">
                PreOwned
              </span>
            </Link>
          </div>

          {/* DESKTOP NAV LINKS */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium tracking-wide">

            <Link href="/" className="text-slate-300 hover:text-[#06b6d4] transition-colors">Home</Link>
            <Link href="/products" className="text-slate-300 hover:text-[#06b6d4] transition-colors">Products</Link>
            <Link href="/blogs" className="text-slate-300 hover:text-[#06b6d4] transition-colors">Blogs</Link>

          </div>

          {/* DYNAMIC AUTH SECTION (DESKTOP) */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {/* User Info & Avatar */}
                <div className="flex items-center space-x-2 bg-slate-800/50 pl-2 pr-3 py-1 rounded-full border border-slate-700">
                  <img
                    src={user?.photoURL || "https://placehold.co/150"}
                    alt="Profile"
                    className="w-8 h-8 rounded-full border-2 border-[#06b6d4] object-cover"
                  />
                  <span className="text-xs font-semibold max-w-[100px] truncate">{user?.displayName || "User"}</span>
                </div>

                {/* Dashboard Link */}
                <Link href="/dashboard">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center space-x-1 text-xs bg-[#06b6d4] hover:bg-[#0891b2] text-slate-900 font-bold px-4 py-2 rounded-full transition-colors uppercase tracking-wider shadow-lg shadow-cyan-500/10"
                  >
                    <LayoutDashboard className="h-3 w-3" />
                    <span>Dashboard</span>
                  </motion.button>
                </Link>

                {/* Logout Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={logoutUser}
                  className="p-2 bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 rounded-full border border-slate-700 hover:border-rose-900/50 transition-all"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login" className="text-xs font-bold uppercase tracking-widest text-slate-300 hover:text-white px-4 py-2 transition-colors">
                  Login
                </Link>
                <Link href="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="text-xs bg-gradient-to-r from-[#059669] to-[#10b981] hover:from-[#10b981] hover:to-[#059669] text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-500/10 uppercase tracking-widest"
                  >
                    Register
                  </motion.button>
                </Link>
              </div>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-400 hover:text-white focus:outline-none p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#1e293b] border-t border-slate-800 px-4 pt-2 pb-6 space-y-3 shadow-xl"
          >
            <Link href="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800">Home</Link>
            <Link href="/products" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800">Products</Link>
            <Link href="/blogs" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800">Blogs</Link>
            
            <div className="pt-4 border-t border-slate-800">
              {user ? (
                <div className="space-y-3 px-3">
                  <div className="flex items-center space-x-3">
                    <img src={user?.photoURL || "https://placehold.co/150"} alt="Profile" className="w-10 h-10 rounded-full border border-[#06b6d4]" />
                    <div>
                      <h4 className="text-sm font-bold">{user?.displayName}</h4>
                      <p className="text-xs text-slate-400 truncate max-w-[200px]">{user?.email}</p>
                    </div>
                  </div>
                  <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center space-x-2 w-full justify-center bg-[#06b6d4] text-slate-900 font-bold py-2.5 rounded-lg text-xs uppercase tracking-wider">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                  <button onClick={() => { logoutUser(); setIsOpen(false); }} className="flex items-center space-x-2 w-full justify-center bg-rose-950/40 border border-rose-900 text-rose-400 py-2.5 rounded-lg text-xs uppercase tracking-wider">
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 px-3">
                  <Link href="/login" onClick={() => setIsOpen(false)} className="text-center border border-slate-700 hover:bg-slate-800 text-slate-300 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider">
                    Login
                  </Link>
                  <Link href="/register" onClick={() => setIsOpen(false)} className="text-center bg-[#06b6d4] text-slate-900 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}