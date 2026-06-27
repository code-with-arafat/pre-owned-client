"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth"; // 👈 আপনার প্রজেক্টের রিয়েল ফায়ারবেস হুক ইমপোর্ট করা হলো

// লাইভ ব্যাকএন্ড বেইজ ইউআরএল
const BACKEND_URL = "https://pre-owned-server-seven.vercel.app";

// স্ট্রাইপ পাবলিক কি লোড করা
const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 
    "pk_test_51TmnwN1PB5nVIIKFapozwHiy9WiHutnBiRCbi8E9hD9eEGZALE32L7vgiPMvIh9aDHXwt3uj21vnl8Aatuvi9AM900n7dw1Ivo"
);

// ভেতরের চেক아উট ফর্ম কম্পোনেন্ট
const CheckoutForm = ({ product, user }) => {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();
    const [error, setError] = useState("");
    const [clientSecret, setClientSecret] = useState("");
    const [processing, setProcessing] = useState(false);
    const [transactionId, setTransactionId] = useState("");

    // প্রোডাক্টের দাম অনুযায়ী পেমেন্ট ইন্টেন্ট কল করা
    useEffect(() => {
        if (product?.price) {
            axios.post(`${BACKEND_URL}/create-payment-intent`, { price: product.price })
                .then(res => {
                    setClientSecret(res.data.clientSecret);
                })
                .catch(err => console.error("Payment Intent Error:", err));
        }
    }, [product?.price]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const card = elements.getElement(CardElement);

        if (card === null) {
            return;
        }

        setProcessing(true);

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card,
        });

        if (error) {
            setError(error.message);
            setProcessing(false);
            return;
        } else {
            setError("");
        }

        // পেমেন্ট কনফার্ম করা
        const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: card,
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
            
            // পেমেন্ট সফল হলে ডাটাবেজে অর্ডার ও পেমেন্ট সেভ করার অবজেক্ট
            const paymentData = {
                transactionId: paymentIntent.id,
                amount: product.price,
                productId: product._id,
                productTitle: product.title,
                productImage: product.images?.[0] || "https://placehold.co/150",
                buyerId: user?.uid || "temp-buyer-id",
                buyerName: user?.displayName || "Anonymous",
                buyerEmail: user?.email || "buyer@mail.com",
                sellerId: product.sellerInfo?.userId || "temp-seller-id",
                sellerName: product.sellerInfo?.name || "Seller",
                sellerEmail: product.sellerInfo?.email || "seller@mail.com",
            };

            try {
                // ব্যাকএন্ডের পেমেন্ট এপিআই কল
                const res = await axios.post(`${BACKEND_URL}/payments`, paymentData);
                if (res.data?.paymentResult?.insertedId) {
                    alert("Payment Successful & Order Placed!");
                    router.push("/dashboard/my-orders");
                }
            } catch (err) {
                console.error("Error saving payment to DB:", err);
                setError("Failed to save order. Please contact support.");
            }
        }
        setProcessing(false);
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-[#1e293b] p-6 rounded-2xl border border-slate-700 mt-10 text-white">
            <h2 className="text-lg font-bold mb-4 text-center">Complete Your Payment</h2>
            <div className="mb-4">
                <p className="text-xs text-slate-400">Product: <span className="text-cyan-400 font-semibold">{product?.title}</span></p>
                <p className="text-xs text-slate-400">Amount to pay: <span className="text-emerald-400 font-bold">BDT {product?.price}</span></p>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 mb-4">
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: "16px",
                                color: "#ffffff",
                                "::placeholder": {
                                    color: "#64748b",
                                },
                            },
                            invalid: {
                                color: "#ef4444",
                            },
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
                {processing ? "Processing..." : `Pay BDT ${product?.price}`}
            </button>
        </form>
    );
};

// মেইন পেমেন্ট পেজ (ডাটা ফেচিং)
export default function PaymentPage() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // 👈 ডামি ইউজার ہটিয়ে দিয়ে সরাসরি Firebase Auth থেকে লগড-ইন ইউজার নেওয়া হলো
    const { user } = useAuth(); 

    useEffect(() => {
        if (id) {
            axios.get(`${BACKEND_URL}/products/${id}`)
                .then(res => {
                    setProduct(res.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Error fetching product details:", err);
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