
import Navbar from "@/components/Navber";
import "./globals.css";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "ReSell Hub | Pre-Owned Marketplace",
  description: "Buy and sell second-hand products easily.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 text-gray-900 flex flex-col min-h-screen">
        <AuthProvider>
        <Navbar />
        {/* মেইন কন্টেন্ট বাকি জায়গাটা দখল করবে ফুটারকে নিচে পুশ করার জন্য */}
        <div className="flex-grow">
          {children}
        </div>
        <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}