"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft, AlertOctagon, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="bg-[#0f172a] text-slate-100 min-h-screen flex items-center justify-center px-4 font-sans relative overflow-hidden">
      {/* Background Glowing Effects */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center">
        <div className="w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="w-[250px] h-[250px] bg-emerald-500/10 rounded-full blur-[100px] delay-75"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full bg-[#1e293b]/60 border border-slate-800 p-8 sm:p-10 rounded-3xl text-center backdrop-blur-xl shadow-2xl relative"
      >
        {/* Animated Badge Icon */}
        <div className="mx-auto bg-cyan-500/10 w-20 h-20 flex items-center justify-center rounded-3xl border border-cyan-500/20 mb-6 shadow-inner">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          >
            <Compass className="w-10 h-10 text-[#06b6d4]" />
          </motion.div>
        </div>

        {/* 404 Big Gradient Text */}
        <h1 className="text-7xl sm:text-8xl font-black tracking-widest bg-gradient-to-r from-[#059669] via-[#06b6d4] to-blue-500 bg-clip-text text-transparent">
          404
        </h1>

        <h2 className="text-2xl font-bold text-white mt-2">
          Page Not Found
        </h2>

        <p className="text-slate-400 text-sm mt-3 leading-relaxed">
          Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/" className="w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto bg-gradient-to-r from-[#059669] to-[#06b6d4] text-slate-950 font-bold px-6 py-3.5 rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/10 text-sm cursor-pointer"
            >
              <Home className="h-4 w-4" />
              <span>Back to Home</span>
            </motion.button>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 text-sm font-semibold px-6 py-3.5 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go Back</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}