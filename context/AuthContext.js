"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/firebase.config";
import axios from "axios"; // 👈 ১. প্রথমে axios ইমপোর্ট করে নিলাম
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from "firebase/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const googleProvider = new GoogleAuthProvider();

  // 🎯 ইউজারের ইমেইল চেক করে রোল রিটার্ন করার কাস্টম ফাংশন
  const getUserRole = (email) => {
    if (!email) return "buyer";
    
    // 💡 আপনার টেস্টিং ইমেইলগুলো এখানে বসিয়ে রোল সেট করতে পারবেন
    if (email.includes("arafat") || email === "arafatinfo3@gmail.com") {
      return "admin"; 
    } else if (email.includes("seller") || email === "seller@gmail.com") {
      return "seller";
    }
    
    return "buyer"; // ডিফল্টভাবে সবাই Buyer (ক্রেতা)
  };

  // ১. সাইন আপ (ইমেইল-পাসওয়ার্ড)
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // ২. লগইন (ইমেইল-পাসওয়ার্ড)
  const loginUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // ৩. গুগল লগইন
  const loginWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  // ৪. লগআউট
  const logoutUser = () => {
    setLoading(true);
    return signOut(auth);
  };
  
  // ৪. প্রোফাইল আপডেট (নাম ও ছবি)
  const updateUserProfile = (name, photoURL) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photoURL
    }).then(() => {
      // প্রোফাইল আপডেট হলে স্টেট রিফ্রেশ করা
      setUser((prev) => ({ ...prev, displayName: name, photoURL: photoURL }));
    });
  };

  // ৫. ইউজার স্টেট ট্র্যাকিং (Observer) + JWT টোকেন জেনারেশন (UPDATED)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const role = getUserRole(currentUser.email);
        setUser({
          ...currentUser,
          role: role
        });

        // 🔒 🚀 ২. ইউজার লগইন থাকলে ব্যাক-এন্ড থেকে টোকেন এনে LocalStorage-এ সেট করা হচ্ছে
        const userInfo = { email: currentUser.email };
        axios.post('http://localhost:5000/jwt', userInfo)
          .then(res => {
            if (res.data.token) {
              localStorage.setItem('access-token', res.data.token);
              setLoading(false);
            }
          })
          .catch(err => {
            console.error("JWT Token generation failed:", err);
            setLoading(false);
          });

      } else {
        setUser(null);
        // 🔓 ৩. ইউজার লগআউট করলে LocalStorage থেকে টোকেন রিমুভ করে দেওয়া হচ্ছে
        localStorage.removeItem('access-token');
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    loading,
    createUser,
    loginUser,
    loginWithGoogle,
    logoutUser,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}