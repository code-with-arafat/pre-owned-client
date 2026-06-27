// মেইন পেমেন্ট পেজ (ডাটা ফেচিং)
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
                    console.error("Error fetching product details:", err);
                    setLoading(false);
                });
        }
    }, [id]);

    if (loading) {
        return <div className="text-center text-white mt-20">Loading Payment Gateway...</div>;
    }

   
    return (
        <div className="bg-[#0f172a] min-h-screen py-10 flex flex-col items-center justify-center text-white">
            <div className="bg-[#1e293b] p-8 rounded-2xl border border-slate-700 max-w-md w-full text-center">
                <h2 className="text-2xl font-bold mb-4 text-cyan-400">Payment Method</h2>
                <p className="text-slate-300 mb-6">Product: <span className="font-semibold text-white">{product?.title}</span></p>
                <p className="text-emerald-400 font-bold text-lg mb-6">Amount: BDT {product?.price}</p>
                
                {/* Coming Soon */}
                <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl">
                    <p className="text-amber-400 font-bold text-lg">⏳ Payment Method Coming Soon</p>
                    <p className="text-slate-400 text-xs mt-2">We are working on integrating the payment gateway. Please check back later.</p>
                </div>
            </div>
        </div>
    );
}