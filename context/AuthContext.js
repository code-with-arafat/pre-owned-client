"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { 
  auth 
} from "@/firebase.config";
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

  // ১. সাইন আপ (ইমেইল-পাসওয়ার্ড)
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // ২. লগইন (ইমেইল-পাসওয়ার্ড)
  const loginUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // ৩. গুগল লগইন
  const loginWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  // ৪. লগআউট (এটি অলরেডি আপনার কোডে হয়তো আছে, নামটা মিলিয়ে নিন)
  const logoutUser = () => {
    setLoading(true);
    return signOut(auth);
  };
  

  // ৪. প্রোফাইল আপডেট (নাম ও ছবি)
  const updateUserProfile = (name, photoURL) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photoURL
    });
  };

  // ৫. ইউজার স্টেট ট্র্যাকিং (Observer)
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