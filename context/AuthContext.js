"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  updateProfile, 
  onAuthStateChanged 
} from "firebase/auth";
import app from "@/firebase.config"; // আপনার ফায়ারবেস কনফিগ ফাইল পাথ

export const AuthContext = createContext(null);
const auth = getAuth(app);
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
  const updateUserProfile = (name, photo) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });
  };

  // ৫. লগআউট
  const logOut = () => {
    setLoading(true);
    return signOut(auth);
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

// 🔴 এই হুকটির জন্য পেমেন্ট পেজে import { useAuth } কাজ করবে
export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};