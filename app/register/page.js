"use client";
import { useState } from "react"; 
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import api from "@/utils/api"; 
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { createUser, loginWithGoogle, updateUserProfile } = useAuth();
  const [role, setRole] = useState("buyer");

  // ফর্ম সাবমিট হ্যান্ডলার (Firebase + MongoDB Synchronization)
  const onSubmit = async (data) => {
    try {
      // ১. ফায়ারবেস অ্যাকাউন্ট ক্রিয়েশন
      await createUser(data.email, data.password);
      
      // ২. ফায়ারবেস প্রোফাইল আপডেট
      await updateUserProfile(data.name, "https://placehold.co/150");

      // ৩. ডাটাবেজের জন্য অবজেক্ট স্ট্রাকচার তৈরি
      const userData = {
        name: data.name,
        email: data.email,
        photo: "https://placehold.co/150",
        role: role // ইউজারের সিলেক্ট করা ডাইনামিক রোল
      };

      // ৪. লাইভ এক্সপ্রেস সার্ভার হয়ে মঙ্গোডিবি-তে পুশ
      const response = await api.put("/users", userData);

      if (response.data) {
        Swal.fire({
          icon: "success",
          title: `Registration Successful as a ${role.toUpperCase()}!`,
          background: "#1e293b",
          color: "#fff",
          confirmButtonColor: "#06b6d4"
        });

        // ৫. রোল অনুযায়ী কন্ডিশনাল রিডাইরেক্ট
        if (role === "seller") {
          router.push("/dashboard/add-product");
        } else {
          router.push("/products");
        }
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
        background: "#1e293b",
        color: "#fff"
      });
    }
  };

  //  গুগল সাইন আপ হ্যান্ডলার
  const handleGoogleSignUp = async () => {
    try {
      const result = await loginWithGoogle();
      
      const googleUserData = {
        name: result?.user?.displayName || "Google User",
        email: result?.user?.email,
        photo: result?.user?.photoURL || "https://placehold.co/150",
        role: role // গুগল লগইনের সময়ও সিলেক্টেড রোল সিঙ্ক হবে
      };

      await api.put("/users", googleUserData);

      Swal.fire({
        icon: "success",
        title: `Logged in via Google as ${role.toUpperCase()}!`,
        background: "#1e293b",
        color: "#fff",
        confirmButtonColor: "#06b6d4"
      });

      if (role === "seller") {
        router.push("/dashboard/add-product");
      } else {
        router.push("/products");
      }
    } catch (error) {
      console.error("Google Sign Up Sync Error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#a7f3d0]/30 p-4 md:p-8">
      <div className="max-w-5xl w-full grid md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl min-h-[650px]">

        {/* LEFT SIDE: Wavy Mint Gradient & Animated Logo */}
        <div className="relative bg-gradient-to-tr from-[#059669] via-[#10b981] to-[#6ee7b7] p-12 flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -top-10 -left-10 w-96 h-96 bg-white rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-[#34d399] rounded-full blur-3xl"></div>
          </div>

          <motion.div
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 15, delay: 0.2 }}
            whileHover={{ y: -8 }}
            className="relative z-10 bg-[#1e293b] p-8 aspect-square w-48 flex flex-col items-center justify-center text-center shadow-2xl border-4 border-[#06b6d4]/50 polygon-hexagon"
            style={{
              clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"
            }}
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="flex flex-col items-center"
            >
              <ShoppingBag className="text-[#06b6d4] h-10 w-10 mb-2" />
              <span className="text-white text-xs uppercase tracking-widest font-semibold">Company</span>
              <h2 className="text-white text-2xl font-black tracking-tight leading-none my-1">LOGO</h2>
              <span className="text-[#06b6d4] text-[10px] uppercase tracking-widest font-bold">Name</span>
            </motion.div>
          </motion.div>
        </div>

        {/* RIGHT SIDE: Clean Dark Form */}
        <div className="bg-[#1e293b] p-8 sm:p-12 flex flex-col justify-center border-l border-slate-800">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-light text-white tracking-widest uppercase">Register</h2>
            <p className="text-[#06b6d4] text-xs tracking-wider uppercase mt-1">It's completely free</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name Input */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Name</label>
              <input
                type="text"
                {...register("name", { required: "Name is required" })}
                className="mt-1 w-full bg-transparent border-b border-slate-600 py-2 text-white text-sm focus:outline-none focus:border-[#06b6d4] transition-colors"
                placeholder="Your full name"
              />
              {errors.name && <p className="text-rose-400 text-xs mt-1">{errors.name.message}</p>}
            </div>

            {/* Email Input */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email</label>
              <input
                type="email"
                {...register("email", { required: "Email is required" })}
                className="mt-1 w-full bg-transparent border-b border-slate-600 py-2 text-white text-sm focus:outline-none focus:border-[#06b6d4] transition-colors"
                placeholder="Email address"
              />
              {errors.email && <p className="text-rose-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Password Input */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Password</label>
              <input
                type="password"
                {...register("password", { required: "Password is required", minLength: { value: 6, message: "Minimum 6 chars" } })}
                className="mt-1 w-full bg-transparent border-b border-slate-600 py-2 text-white text-sm focus:outline-none focus:border-[#06b6d4] transition-colors"
                placeholder="••••••"
              />
              {errors.password && <p className="text-rose-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {/*  Dynamic Role Selector */}
            <div className="space-y-2 text-xs pt-2">
              <label className="font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Join ReSell Hub As A:
              </label>
              <div className="grid grid-cols-2 gap-4">
                {/* Buyer Tab */}
                <div
                  onClick={() => setRole("buyer")}
                  className={`p-3.5 rounded-2xl border text-center font-bold uppercase tracking-wider cursor-pointer transition-all flex flex-col items-center justify-center gap-1 ${role === "buyer"
                      ? "bg-cyan-500/10 border-[#06b6d4] text-cyan-400 shadow-md shadow-cyan-500/5"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                >
                  <span className="text-sm">🛒</span>
                  <span>I want to Buy</span>
                </div>

                {/* Seller Tab */}
                <div
                  onClick={() => setRole("seller")}
                  className={`p-3.5 rounded-2xl border text-center font-bold uppercase tracking-wider cursor-pointer transition-all flex flex-col items-center justify-center gap-1 ${role === "seller"
                      ? "bg-cyan-500/10 border-[#06b6d4] text-cyan-400 shadow-md shadow-cyan-500/5"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                >
                  <span className="text-sm">💼</span>
                  <span>I want to Sell</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3 bg-[#06b6d4] hover:bg-[#0891b2] text-slate-900 font-bold text-xs uppercase tracking-widest rounded transition-all shadow-lg shadow-cyan-500/10 mt-4"
            >
              Create Account
            </motion.button>
          </form>

          {/* Social Sign In */}
          <div className="mt-6 flex flex-col items-center space-y-3">
            <button
              onClick={handleGoogleSignUp}
              className="text-xs text-slate-400 hover:text-white transition-colors flex items-center space-x-2 cursor-pointer"
            >
              <span>Or Sign Up with Google</span>
            </button>
            <p className="text-xs text-slate-500">
              Already a member? <Link href="/login" className="text-[#06b6d4] hover:underline">Log in</Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}