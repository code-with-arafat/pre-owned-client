import axios from "axios";

// 🌐 আপনার ভার্সেলে ডেপ্লয় করা রিয়েল সার্ভার ইউআরএল
const API_BASE_URL = "https://pre-owned-server-seven.vercel.app"; 

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// 🔒 অটোমেটিক JWT টোকেন ইনজেকশন ইন্টারসেপ্টর
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;