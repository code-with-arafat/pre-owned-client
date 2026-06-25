"use client";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { loginUser, loginWithGoogle } = useAuth();

  const onSubmit = async (data) => {
    try {
      await loginUser(data.email, data.password);
      Swal.fire({
        icon: "success",
        title: "Welcome Back!",
        background: "#1e293b",
        color: "#fff",
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message,
        background: "#1e293b",
        color: "#fff"
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#a7f3d0]/30 p-4 md:p-8">
      <div className="max-w-5xl w-full grid md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl min-h-[600px]">
        
        {/* LEFT SIDE */}
        <div className="relative bg-gradient-to-tr from-[#059669] via-[#10b981] to-[#6ee7b7] p-12 flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -top-10 -left-10 w-96 h-96 bg-white rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-[#34d399] rounded-full blur-3xl"></div>
          </div>

          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
            className="relative z-10 bg-[#1e293b] p-8 aspect-square w-48 flex flex-col items-center justify-center text-center shadow-2xl border-4 border-[#06b6d4]/50"
            style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
          >
            <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}>
              <ShoppingBag className="text-[#06b6d4] h-10 w-10 mb-2" />
              <span className="text-white text-xs uppercase tracking-widest font-semibold">Company</span>
              <h2 className="text-white text-2xl font-black my-1">LOGO</h2>
              <span className="text-[#06b6d4] text-[10px] uppercase tracking-widest font-bold">Name</span>
            </motion.div>
          </motion.div>
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-[#1e293b] p-8 sm:p-12 flex flex-col justify-center border-l border-slate-800">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-light text-white tracking-widest uppercase">Login</h2>
            <p className="text-[#06b6d4] text-xs tracking-wider uppercase mt-1">Welcome back</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email</label>
              <input
                type="email"
                {...register("email", { required: "Email is required" })}
                className="mt-1 w-full bg-transparent border-b border-slate-600 py-2 text-white text-sm focus:outline-none focus:border-[#06b6d4] transition-colors"
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-rose-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Password</label>
              <input
                type="password"
                {...register("password", { required: "Password is required" })}
                className="mt-1 w-full bg-transparent border-b border-slate-600 py-2 text-white text-sm focus:outline-none focus:border-[#06b6d4] transition-colors"
                placeholder="••••••"
              />
              {errors.password && <p className="text-rose-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3 bg-[#06b6d4] hover:bg-[#0891b2] text-slate-900 font-bold text-xs uppercase tracking-widest rounded transition-all shadow-lg mt-2"
            >
              Sign In
            </motion.button>
          </form>

          <div className="mt-6 flex flex-col items-center space-y-3">
            <button onClick={loginWithGoogle} className="text-xs text-slate-400 hover:text-white transition-colors">
              Or Login with Google
            </button>
            <p className="text-xs text-slate-500">
              New here? <Link href="/register" className="text-[#06b6d4] hover:underline">Create account</Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}