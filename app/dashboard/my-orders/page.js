"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

const BACKEND_URL = "https://pre-owned-server-seven.vercel.app";

export default function MyOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      axios
        .get(`${BACKEND_URL}/payments?email=${user.email}`)
        .then((res) => {
          setOrders(res.data || []);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching orders:", err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">
        Loading your orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6 sm:p-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-cyan-400">My Booked Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-[#1e293b] p-8 rounded-2xl border border-slate-800 text-center text-slate-400">
            You haven't booked any products yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-[#1e293b] border border-slate-800 p-5 rounded-2xl flex items-center space-x-4"
              >
                <img
                  src={order.productImage || "https://placehold.co/100"}
                  alt={order.productTitle}
                  className="w-20 h-20 object-cover rounded-xl border border-slate-700"
                />
                <div className="flex-grow">
                  <h3 className="font-bold text-lg text-slate-100">{order.productTitle}</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Transaction ID: <span className="font-mono text-cyan-400">{order.transactionId}</span>
                  </p>
                  <p className="text-emerald-400 font-extrabold mt-2">
                    ৳{order.amount?.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}