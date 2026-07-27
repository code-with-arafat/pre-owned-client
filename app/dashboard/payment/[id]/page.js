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

  const productPrice = product?.price || product?.resalePrice || 0;

  useEffect(() => {
    if (productPrice > 0) {
      axios.post(`${BACKEND_URL}/create-payment-intent`, { price: productPrice })
        .then(res => setClientSecret(res.data.clientSecret))
        .catch(err => console.error("Payment intent creation failed:", err));
    }
  }, [productPrice]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    setProcessing(true);

    const { error: pmError } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (pmError) {
      setError(pmError.message);
      setProcessing(false);
      return;
    }
    
    setError("");

    const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card,
        billing_details: {
          email: user?.email || "anonymous@gmail.com",
          name: user?.displayName || "Anonymous",
        },
      },
    });

    if (confirmError) {
      setError(confirmError.message);
      setProcessing(false);
      return;
    }

    if (paymentIntent.status === "succeeded") {
      setTransactionId(paymentIntent.id);

      const paymentData = {
        transactionId: paymentIntent.id,
        buyerId: user?.uid || "temp-buyer-id",
        buyerName: user?.displayName || "Anonymous",
        buyerEmail: user?.email || "buyer@mail.com",
        orderId: `ORDER-${Date.now()}`,
        amount: productPrice,
        paymentStatus: "Paid",
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
        sellerId: product?.sellerInfo?.userId || "temp-seller-id",
        sellerName: product?.sellerInfo?.name || "Seller",
        sellerEmail: product?.sellerInfo?.email || "seller@mail.com",
      };

      try {
        const res = await axios.post(`${BACKEND_URL}/payments`, paymentData);
        if (res.data?.paymentResult?.insertedId) {
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
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-[#1e293b] p-6 rounded-2xl border border-slate-700 mt-10 text-white">
      <h2 className="text-lg font-bold mb-4 text-center">Complete Your Payment</h2>
      
      <div className="mb-4">
        <p className="text-xs text-slate-400">Product: <span className="text-cyan-400 font-semibold">{product?.title}</span></p>
        <p className="text-xs text-slate-400">Amount to pay: <span className="text-emerald-400 font-bold">BDT {productPrice}</span></p>
      </div>

      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 mb-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#ffffff",
                "::placeholder": { color: "#64748b" },
              },
              invalid: { color: "#ef4444" },
            },
          }}
        />
      </div>

      {error && <p className="text-red-400 text-xs mb-4">{error}</p>}
      {transactionId && <p className="text-emerald-400 text-xs mb-4">Transaction ID: {transactionId}</p>}

      <button 
        type="submit" 
        disabled={!stripe || !clientSecret || processing} 
        className="w-full bg-[#06b6d4] hover:bg-cyan-400 text-slate-900 font-bold py-3 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
      >
        {processing ? "Processing..." : `Pay BDT ${productPrice}`}
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
    return <div className="text-center text-white mt-20">Loading Payment Gateway...</div>;
  }

  return (
    <div className="bg-[#0f172a] min-h-screen py-10">
      <Elements stripe={stripePromise}>
        <CheckoutForm product={product} user={user} />
      </Elements>
    </div>
  );
}