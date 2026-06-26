"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MyOrdersPage() {
    // ডামি ইমেইল - আপনার প্রজেক্টের Auth Context বা সেশন থেকে লগইন করা ইউজারের ইমেইল নিতে হবে
    const user = { email: "testbuyer@gmail.com" }; 
    
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.email) {
            axios.get(`http://localhost:5000/orders/buyer/${user.email}`)
                .then(res => {
                    setOrders(res.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Error fetching orders:", err);
                    setLoading(false);
                });
        }
    }, [user?.email]);

    // 🟢 ইনভয়েস প্রিন্ট বা ডাউনলোড করার ফাংশন
    const handleDownloadInvoice = (order) => {
        const printWindow = window.open("", "_blank", "width=800,height=600");
        
        printWindow.document.write(`
            <html>
                <head>
                    <title>Invoice - ${order.transactionId}</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
                        .invoice-box { max-width: 600px; margin: auto; padding: 30px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, 0.15); border-radius: 8px; }
                        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
                        .title { font-size: 24px; font-weight: bold; color: #0f172a; }
                        .details { margin-bottom: 20px; font-size: 14px; }
                        .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                        .table th, .table td { border: 1px solid #ccc; padding: 12px; text-align: left; font-size: 14px; }
                        .table th { background-color: #f1f5f9; }
                        .total { font-weight: bold; text-align: right; font-size: 16px; }
                        .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #64748b; border-top: 1px solid #eee; padding-top: 15px; }
                    </style>
                </head>
                <body>
                    <div class="invoice-box">
                        <div class="header">
                            <span class="title">RESELL HUB - INVOICE</span>
                        </div>
                        <div class="details">
                            <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
                            <p><strong>Transaction ID:</strong> ${order.transactionId}</p>
                            <p><strong>Buyer Email:</strong> ${order.buyerInfo?.email || 'N/A'}</p>
                            <p><strong>Seller Email:</strong> ${order.sellerInfo?.email || 'N/A'}</p>
                        </div>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Item Description</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>${order.productTitle}</td>
                                    <td>BDT ${order.amount}</td>
                                </tr>
                                <tr>
                                    <td class="total" style="text-align: left;">Total:</td>
                                    <td class="total">BDT ${order.amount}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="footer">
                            <p>Thank you for your purchase from ReSell Hub.</p>
                        </div>
                    </div>
                    <script>
                        window.onload = function() { window.print(); window.close(); }
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    if (loading) {
        return <div className="text-center mt-20 text-white">Loading your orders...</div>;
    }

    return (
        <div className="bg-[#0f172a] min-h-screen p-6 sm:p-10 text-white">
            <h2 className="text-3xl font-black mb-8 border-b border-slate-800 pb-4">My Orders</h2>
            
            {orders.length === 0 ? (
                <div className="bg-[#1e293b]/40 border border-slate-800 rounded-2xl p-10 text-center text-slate-400">
                    You have no purchased products yet.
                </div>
            ) : (
                <div className="overflow-x-auto bg-[#1e293b]/40 border border-slate-800 rounded-2xl backdrop-blur-md">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-slate-700 text-slate-300">
                                <th className="p-4">Image</th>
                                <th className="p-4">Product Title</th>
                                <th className="p-4">Price</th>
                                <th className="p-4">Transaction ID</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-center">Invoice</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order._id} className="border-b border-slate-800/60 hover:bg-slate-800/20">
                                    <td className="p-4">
                                        <img 
                                            src={order.productImage} 
                                            alt={order.productTitle} 
                                            className="w-16 h-16 object-cover rounded-xl border border-slate-700" 
                                        />
                                    </td>
                                    <td className="p-4 font-bold text-white">{order.productTitle}</td>
                                    <td className="p-4 text-emerald-400 font-bold">BDT {order.amount}</td>
                                    <td className="p-4 font-mono text-xs text-slate-400">{order.transactionId}</td>
                                    <td className="p-4">
                                        <span className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-extrabold uppercase px-3 py-1.5 rounded-xl">
                                            {order.orderStatus || 'Processing'}
                                        </span>
                                    </td>
                                    {/* 🟢 ইনভয়েস প্রিন্ট বাটন কলাম */}
                                    <td className="p-4 text-center">
                                        <button 
                                            onClick={() => handleDownloadInvoice(order)}
                                            className="bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-600 text-xs font-bold px-3 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap"
                                        >
                                            Print Invoice
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}