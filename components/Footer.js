import Link from "next/link";


export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold text-white mb-4">ReSell Hub</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted marketplace to buy and sell pre-owned premium products smoothly and securely.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-blue-400 transition-colors">All Products</Link></li>
              <li><Link href="/blogs" className="hover:text-blue-400 transition-colors">Blogs & Articles</Link></li>
              <li><Link href="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Support</h4>
            <p className="text-sm text-gray-400">Have questions? Contact our 24/7 support team.</p>
            <p className="text-sm text-blue-400 font-semibold mt-2">support@resellhub.com</p>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} ReSell Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}