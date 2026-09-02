import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "PreOwned | Pre-Owned Marketplace",
  description: "Buy and sell second-hand products easily.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-gray-50 text-gray-900 flex flex-col min-h-screen">
        <AuthProvider>
        <Navbar />
        <div className="flex-grow">
          {children}
        </div>
        <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}