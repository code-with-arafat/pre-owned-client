"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

const BACKEND_URL = "https://pre-owned-server-seven.vercel.app";

export default function MyOrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    if (user?.email) {
      setLoading(true);
      setError("");

      const token = typeof window !== "undefined" ? localStorage.getItem("access-token") : null;
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      axios
        .get(`${BACKEND_URL}/payments?email=${encodeURIComponent(user.email)}`, config)
        .then((res) => {
          if (isMounted) {
            setOrders(Array.isArray(res.data) ? res.data : []);
            setLoading(false);
          }
        })
        .catch((err) => {
          if (isMounted) {
            console.error("Error fetching orders:", err);
            setError("Failed to load your orders. Please try again later.");
            setLoading(false);
          }
        });
    } else if (!authLoading && !user) {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [user, authLoading]);

  // Loading Skeleton
  if (authLoading || loading) {
    return (
      <div className="bg-[#0f172a] min-h-screen text-white p-6 sm:p-10">
        <div className="max-w-5xl mx-auto">
          <div className="h-8 bg-slate-800 rounded w-48 mb-8 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-[#1e293b] border border-slate-800 p-5 rounded-2xl flex items-center space-x-4 animate-pulse"
              >
                <div className="w-20 h-20 bg-slate-700 rounded-xl flex-shrink-0" />
                <div className="flex-grow space-y-3">
                  <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-700 rounded w-1/2"></div>
                  <div className="h-4 bg-slate-700 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0f172a] min-h-screen text-white p-6 sm:p-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-cyan-400">My Orders ({orders.length})</h1>
            <p className="text-slate-400 text-sm mt-1">
              আপনার সফলভাবে পেমেন্ট করা সকল অর্ডারের তালিকা
            </p>
          </div>
        </div>

        {/* Error View */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-6 rounded-2xl text-center">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!error && orders.length === 0 && (
          <div className="bg-[#1e293b] p-12 rounded-2xl border border-slate-800 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-slate-500 text-2xl">
              📦
            </div>
            <h3 className="text-xl font-semibold text-slate-200">No orders found</h3>
            <p className="text-slate-400 max-w-md text-sm">
              আপনি এখনো কোনো কেনাকাটা করেননি। আমাদের শপ থেকে পছন্দের প্রোডাক্টটি বেছে নিন!
            </p>
            <Link
              href="/products"
              className="mt-2 inline-flex items-center justify-center px-6 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-semibold rounded-xl transition duration-200"
            >
              প্রোডাক্ট দেখুন
            </Link>
          </div>
        )}

        {/* Orders Grid */}
        {!error && orders.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {orders.map((order) => {
              // items অ্যারে থেকে প্রথম আইটেমটি নিরাপদে ফেচ করা
              const firstItem = Array.isArray(order.items) && order.items.length > 0 ? order.items[0] : {};

              // প্রোডাক্ট টাইটেল (items বা রুট লেভেল থেকে)
              const title =
                firstItem.title ||
                firstItem.name ||
                firstItem.productTitle ||
                order.productTitle ||
                order.title ||
                "Purchased Item";

              // প্রোডাক্ট ইমেজ (items বা রুট লেভেল থেকে)
              const imageSrc =
                firstItem.image ||
                firstItem.productImage ||
                (Array.isArray(firstItem.images) && firstItem.images[0]) ||
                order.productImage ||
                order.image ||
                null;

              return (
                <div
                  key={order._id || order.transactionId}
                  className="bg-[#1e293b] border border-slate-800/80 hover:border-slate-700 p-5 rounded-2xl flex items-center space-x-4 transition-all duration-200 shadow-lg"
                >
                  {/* Product Image */}
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-700 flex-shrink-0 bg-slate-800 flex items-center justify-center">
                    {imageSrc ? (
                      <Image
                        src={imageSrc}
                        alt={title}
                        fill
                        sizes="80px"
                        className="object-cover"
                        unoptimized={typeof imageSrc === "string" && imageSrc.startsWith("http")}
                      />
                    ) : (
                      <span className="text-2xl">🛍️</span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-grow min-w-0">
                    <h3 className="font-bold text-lg text-slate-100 truncate" title={title}>
                      {title}
                    </h3>

                    <div className="text-xs text-slate-400 mt-1 flex flex-col gap-0.5">
                      <p>
                        Order ID:{" "}
                        <span className="font-mono text-cyan-400 bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-800/50">
                          {order.orderId || order.transactionId?.slice(-10) || "N/A"}
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <p className="text-emerald-400 font-extrabold text-lg">
                        BDT {order.amount ? Number(order.amount).toLocaleString() : "0"}
                      </p>
                      <span className="text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full capitalize">
                        {order.paymentStatus || "Paid"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}