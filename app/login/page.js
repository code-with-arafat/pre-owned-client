"use client";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { signIn, googleSignIn } = useAuth();
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      await signIn(data.email, data.password);
      
      Swal.fire({
        icon: "success",
        title: "Welcome Back!",
        background: "#0f172a",
        color: "#fff",
        timer: 1500,
        showConfirmButton: false
      });

      router.push("/dashboard"); 

    } catch (error) {
      console.error("Login error detail:", error);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message || "Invalid email or password",
        background: "#0f172a",
        color: "#fff"
      });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleSignIn();
      
      Swal.fire({
        icon: "success",
        title: "Welcome Back!",
        background: "#0f172a",
        color: "#fff",
        timer: 1500,
        showConfirmButton: false
      });

      router.push("/dashboard");

    } catch (error) {
      console.error("Google login error detail:", error);
      Swal.fire({
        icon: "error",
        title: "Google Login Failed",
        text: error.message,
        background: "#0f172a",
        color: "#fff"
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 md:p-8 relative overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl w-full grid md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl min-h-[580px] z-10">
        
        {/* LEFT SIDE - Brand Showcase */}
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 p-12 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-800/60 overflow-hidden">
          
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.08)_0,transparent_70%)]" />

          {/* Glowing Hexagon Card */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
            className="relative z-10 bg-slate-950/80 p-8 aspect-square w-48 flex flex-col items-center justify-center text-center shadow-2xl border border-cyan-500/30 rounded-2xl backdrop-blur-md group hover:border-cyan-500/60 transition-colors"
          >
            <div className="absolute inset-0 bg-cyan-500/5 rounded-2xl blur-xl group-hover:bg-cyan-500/10 transition-colors" />
            
            <motion.div 
              animate={{ y: [0, -6, 0] }} 
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="relative z-10 flex flex-col items-center"
            >
              <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20 mb-3">
                <ShoppingBag className="text-cyan-400 h-8 w-8" />
              </div>
              <span className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-medium">PreOwned</span>
              <h2 className="text-white text-2xl font-black tracking-wider my-0.5">MARKET</h2>
              <span className="text-cyan-400 text-[10px] uppercase tracking-widest font-bold">Platform</span>
            </motion.div>
          </motion.div>

          <div className="mt-8 text-center relative z-10">
            <h3 className="text-slate-200 font-semibold text-lg">Deals on PreOwned Goods</h3>
            <p className="text-slate-400 text-xs mt-1 max-w-xs">Buy and sell verified second-hand items with complete confidence.</p>
          </div>
        </div>

        {/* RIGHT SIDE - Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center bg-slate-900/60">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white tracking-tight">Sign In</h2>
            <p className="text-slate-400 text-xs mt-1">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">Email Address</label>
              <input
                type="email"
                {...register("email", { required: "Email is required" })}
                className="w-full bg-slate-950/60 border border-slate-700/60 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
                placeholder="name@example.com"
              />
              {errors.email && <p className="text-rose-400 text-xs mt-1.5">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">Password</label>
              </div>
              <input
                type="password"
                {...register("password", { required: "Password is required" })}
                className="w-full bg-slate-950/60 border border-slate-700/60 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
                placeholder="••••••••"
              />
              {errors.password && <p className="text-rose-400 text-xs mt-1.5">{errors.password.message}</p>}
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              className="w-full py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              Sign In
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900/60 px-3 text-slate-500 font-medium">Or continue with</span>
            </div>
          </div>

          {/* Social Login Button */}
          <button 
            type="button"
            onClick={handleGoogleLogin} 
            className="w-full py-3 bg-slate-950/80 hover:bg-slate-800/80 text-slate-300 font-medium text-xs rounded-xl border border-slate-700/60 transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            Sign in with Google
          </button>

          <p className="text-center text-xs text-slate-500 mt-6">
            Don't have an account?{" "}
            <Link href="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold hover:underline transition-colors">
              Create one now
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}