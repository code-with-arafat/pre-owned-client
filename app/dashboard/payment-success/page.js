"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("transactionId");
  const amount = searchParams.get("amount");

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col justify-center items-center p-4">
      <div className="bg-[#1e293b] p-8 rounded-2xl border border-slate-700 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
          ✓
        </div>
        <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-slate-400 text-sm mb-6">Thank you for your purchase.</p>

        <div className="bg-slate-900 p-4 rounded-xl text-left text-xs space-y-2 mb-6 border border-slate-800">
          <p className="flex justify-between">
            <span className="text-slate-400">Transaction ID:</span>
            <span className="font-mono text-cyan-400">{transactionId}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-slate-400">Amount Paid:</span>
            <span className="font-bold text-emerald-400">BDT {amount}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-slate-400">Date:</span>
            <span>{new Date().toLocaleDateString()}</span>
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link href="/dashboard/my-orders" className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 rounded-xl transition">
            Go to My Orders
          </Link>
          <Link href="/products" className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-3 rounded-xl transition">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}