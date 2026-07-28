"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  updateProfile, 
  onAuthStateChanged 
} from "firebase/auth";
import { auth } from "@/firebase.config";
import api from "@/utils/api"; // আপনার Axios/API হেলপার ইমপোর্ট করুন

export const AuthContext = createContext(null);
const googleProvider = new GoogleAuthProvider();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ১. ইমেইল ও পাসওয়ার্ড দিয়ে অ্যাকাউন্ট তৈরি
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // ২. ইমেইল ও পাসওয়ার্ড দিয়ে লগইন
  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // ৩. গুগল দিয়ে লগইন
  const googleSignIn = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  // ৪. প্রোফাইল আপডেট (নাম ও প্রোফাইল পিকচার)
  const updateUserProfile = async (name, photo) => {
    if (!auth.currentUser) return;
    await updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });
    
    // আগের স্টেট ঠিক রেখে নাম ও ছবি লোকালি আপডেট
    setUser((prevUser) => 
      prevUser 
        ? { ...prevUser, displayName: name, photoURL: photo } 
        : null
    );
  };

  // ৫. লগআউট (টোকেন ক্লিনআপসহ)
  const logOut = async () => {
    setLoading(true);
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("access-token");
      }
      return await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🛠️ ৬. ইউজার স্টেট অবজার্ভার (FIXED: MongoDB থেকে Role ফেচ করা হচ্ছে)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser?.email) {
        try {
          // MongoDB ব্যাকএন্ড থেকে ইউজারের ডাটা আনুন
          const res = await api.get(`/users/${encodeURIComponent(currentUser.email)}`);
          const dbUser = res.data;

          // Firebase User এর সাথে MongoDB Role ও ডাটা মার্জ করে সেট করা হলো
          setUser({
            ...currentUser,
            role: dbUser?.role || "buyer", // MongoDB থেকে পাওয়া রোল (admin / seller / buyer)
            dbData: dbUser
          });
        } catch (error) {
          console.error("MongoDB user role fetch failed:", error);
          // কোনো কারণে ব্যাকএন্ড ফেল করলে ডিফল্ট ফায়ারবেজ ইউজার সেট থাকবে
          setUser(currentUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    loading,
    setLoading,
    createUser,
    signIn,
    googleSignIn,
    updateUserProfile,
    logOut,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook Export
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};