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
// 🛠️ সরাসরি আপনার firebase.config থেকে auth ইমপোর্ট করা হলো
import { auth } from "@/firebase.config";

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
    // লোকাল ইউজার স্টেট ইনস্ট্যান্ট আপডেট করার জন্য
    setUser({ ...auth.currentUser });
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
      setLoading(false);
    }
  };

  // ৬. ইউজার স্টেট অবজার্ভার
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
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

// custom hook export
export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};