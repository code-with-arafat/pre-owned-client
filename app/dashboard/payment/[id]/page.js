"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

const BACKEND_URL = "https://pre-owned-server-seven.vercel.app";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 
  "pk_test_51P6QatJyiW8grYrE6BjAO0JwYYzj53Je1aun3pBVVdHCDWeKwkQjGr19fvT1gAad79H4xZvBrNdv9A12ufFrqOgO002cBsZbum"
);

const CheckoutForm = ({ product, user }) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [error, setError] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [processing, setProcessing] = useState(false);
  const [transactionId, setTransactionId] = useState("");

  // 📝 Buyer info input fields state
  const [formData, setFormData] = useState({
    buyerName: user?.displayName || "",
    buyerPhone: "",
    buyerAddress: "",
    shippingAddress: "",
    sameAsBilling: true, // Toggle for shipping address
  });

  // Keep buyerName synced if user loads late
  useEffect(() => {
    if (user?.displayName && !formData.buyerName) {
      setFormData((prev) => ({ ...prev, buyerName: user.displayName }));
    }
  }, [user]);

  // Convert price to explicit number
  const productPrice = Number(product?.resalePrice || product?.price || 0);

  useEffect(() => {
    if (productPrice > 0 && !isNaN(productPrice)) {
      axios.post(`${BACKEND_URL}/create-payment-intent`, { price: productPrice })
        .then(res => {
          if (res.data?.clientSecret) {
            setClientSecret(res.data.clientSecret);
          }
        })
        .catch(err => console.error("Payment intent creation failed:", err));
    }
  }, [productPrice]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // ⚠️ Validation Check
    if (!formData.buyerName.trim()) {
      setError("Please provide your name.");
      return;
    }
    if (!formData.buyerPhone.trim()) {
      setError("Please provide your mobile number.");
      return;
    }
    if (!formData.buyerAddress.trim()) {
      setError("Please provide your billing address.");
      return;
    }

    const finalShippingAddress = formData.sameAsBilling 
      ? formData.buyerAddress 
      : formData.shippingAddress;

    if (!formData.sameAsBilling && !finalShippingAddress.trim()) {
      setError("Please provide a valid shipping address.");
      return;
    }

    if (!stripe || !elements || !clientSecret) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    setProcessing(true);
    setError("");

    // Stripe card payment confirmation
    const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: card,
        billing_details: {
          email: user?.email || "anonymous@gmail.com",
          name: formData.buyerName,
          phone: formData.buyerPhone,
          address: {
            line1: formData.buyerAddress,
          },
        },
      },
    });

    if (confirmError) {
      setError(confirmError.message);
      setProcessing(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      setTransactionId(paymentIntent.id);

      // Order payload sent to database
      const paymentData = {
        transactionId: paymentIntent.id,
        
        productId: product?._id,
        productTitle: product?.title || product?.name || "Untitled Product",
        productImage: product?.images?.[0] || product?.image || "https://placehold.co/150",
        
        // Buyer details
        buyerId: user?.uid || "temp-buyer-id",
        buyerName: formData.buyerName,
        buyerEmail: user?.email || "buyer@mail.com",
        buyerPhone: formData.buyerPhone,
        buyerAddress: formData.buyerAddress,
        shippingAddress: finalShippingAddress,
        
        // Seller details
        sellerId: product?.sellerInfo?.userId || "temp-seller-id",
        sellerName: product?.sellerInfo?.name || "Seller",
        sellerEmail: product?.sellerInfo?.email || "seller@mail.com",
        
        // Order metadata
        orderId: `ORDER-${Date.now()}`,
        amount: productPrice,
        paymentStatus: "Paid",
        orderStatus: "processing", 
        paymentMethod: "Stripe",
        paymentDate: new Date().toISOString(),

        items: [
          {
            productId: product?._id,
            title: product?.title || "Untitled Product",
            image: product?.images?.[0] || product?.image || "https://placehold.co/150",
            price: productPrice,
            quantity: 1,
          }
        ],
      };

      try {
        const res = await axios.post(`${BACKEND_URL}/payments`, paymentData);
        if (res.data?.paymentResult?.insertedId || res.data?.insertedId) {
          router.push(`/dashboard/payment-success?transactionId=${paymentIntent.id}&amount=${productPrice}`);
        }
      } catch (err) {
        console.error("Failed to save order:", err);
        setError("Payment received, but failed to record order. Please contact support.");
      }
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-[#1e293b] p-6 sm:p-8 rounded-2xl border border-slate-700 my-10 text-white shadow-xl">
      <h2 className="text-xl font-bold mb-6 text-center text-cyan-400">Complete Your Order</h2>
      
      {/* Product Summary */}
      <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400">Product</p>
          <p className="text-sm font-semibold text-slate-200">{product?.title}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400">Amount to pay</p>
          <p className="text-lg font-bold text-emerald-400">BDT {productPrice}</p>
        </div>
      </div>

      {/* Buyer Info Form Fields */}
      <div className="space-y-4 mb-6">
        <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400 border-b border-slate-800 pb-2">
          Shipping & Contact Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
            <input
              type="text"
              name="buyerName"
              value={formData.buyerName}
              onChange={handleInputChange}
              placeholder="Enter your name"
              required
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile Number *</label>
            <input
              type="tel"
              name="buyerPhone"
              value={formData.buyerPhone}
              onChange={handleInputChange}
              placeholder="e.g. 01700000000"
              required
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Billing Address *</label>
          <input
            type="text"
            name="buyerAddress"
            value={formData.buyerAddress}
            onChange={handleInputChange}
            placeholder="House/Street, Area, City"
            required
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Shipping address toggle */}
        <div className="pt-2">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
            <input
              type="checkbox"
              checked={formData.sameAsBilling}
              onChange={(e) => setFormData((prev) => ({ ...prev, sameAsBilling: e.target.checked }))}
              className="w-4 h-4 rounded bg-slate-900 border-slate-800 text-cyan-500 focus:ring-0"
            />
            <span>Shipping address is same as billing address</span>
          </label>
        </div>

        {!formData.sameAsBilling && (
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Shipping Address *</label>
            <input
              type="text"
              name="shippingAddress"
              value={formData.shippingAddress}
              onChange={handleInputChange}
              placeholder="Different delivery location details"
              required={!formData.sameAsBilling}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        )}
      </div>

      {/* Payment Information */}
      <div className="mb-6">
        <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400 border-b border-slate-800 pb-2 mb-3">
          Card Information
        </h3>
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "15px",
                  color: "#ffffff",
                  "::placeholder": { color: "#64748b" },
                },
                invalid: { color: "#ef4444" },
              },
            }}
          />
        </div>
      </div>

      {error && <p className="text-rose-400 text-xs mb-4 bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl">{error}</p>}
      {transactionId && <p className="text-emerald-400 text-xs mb-4">Transaction ID: {transactionId}</p>}

      <button 
        type="submit" 
        disabled={!stripe || !clientSecret || processing} 
        className="w-full bg-[#06b6d4] hover:bg-cyan-400 text-slate-900 font-black py-3.5 rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-cyan-500/10"
      >
        {processing ? "Processing Order..." : `Pay BDT ${productPrice}`}
      </button>
    </form>
  );
};

export default function PaymentPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth(); 

  useEffect(() => {
    if (id) {
      axios.get(`${BACKEND_URL}/products/${id}`)
        .then(res => {
          setProduct(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error loading product:", err);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0f172a] text-slate-300 text-sm font-semibold">
        Loading Payment Gateway...
      </div>
    );
  }

  return (
    <div className="bg-[#0f172a] min-h-screen py-10 px-4">
      <Elements stripe={stripePromise}>
        <CheckoutForm product={product} user={user} />
      </Elements>
    </div>
  );
}