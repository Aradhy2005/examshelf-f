"use client";

import { useState, Suspense } from "react"; // Added Suspense
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { googleProvider } from "@/lib/googleAuth";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

// --- LOGIN CONTENT COMPONENT ---
function LoginContent() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const loginEmail = async () => {
    if (!email || !password) return toast.error("Enter email & password");
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Welcome back 👋");
      router.push("/");
    } catch {
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const loginGoogle = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
      toast.success("Signed in with Google");
      router.push("/");
    } catch {
      toast.error("Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!email) return toast.error("Enter email first");
    try {
        await sendPasswordResetEmail(auth, email);
        toast.success("Password reset email sent");
    } catch (err) {
        toast.error("Reset failed. Try again.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 text-white relative overflow-hidden">
      {/* Glow Background */}
      <div className="absolute inset-0 -z-10 flex justify-center">
        <div className="w-[900px] h-[700px] bg-purple-600/10 blur-[160px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md rounded-3xl bg-[#020617]/80 border border-white/10 p-10 shadow-2xl backdrop-blur-xl"
      >
        <h2 className="text-3xl font-bold text-center">Welcome Back</h2>
        <p className="text-center text-gray-400 text-sm mt-2 mb-8">Continue your focused preparation</p>

        <button
          onClick={loginGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white text-black py-3 rounded-xl font-medium hover:scale-[1.02] active:scale-[0.98] transition mb-6"
        >
          <img src="/google.svg" className="w-5 h-5" alt="google" />
          Continue with Google
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs text-gray-400">OR</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <input
          type="email"
          placeholder="Email address"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="relative mb-3">
          <input
            type={showPass ? "text" : "password"}
            placeholder="Password"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-gray-400 hover:text-white">
            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="text-right mb-6">
          <button onClick={resetPassword} className="text-sm text-purple-400 hover:underline">Forgot password?</button>
        </div>

        <button
          onClick={loginEmail}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:scale-[1.02] active:scale-[0.98] transition font-medium flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="animate-spin" size={18} />}
          {loading ? "Signing in..." : "Login"}
        </button>

        <p className="text-center text-sm text-gray-400 mt-6">
          New here?{" "}
          <span onClick={() => router.push("/signup")} className="text-purple-400 hover:underline cursor-pointer">
            Create an account
          </span>
        </p>
      </motion.div>
    </main>
  );
}

// --- MAIN EXPORT ---
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-black" />}>
      <LoginContent />
    </Suspense>
  );
}

// Move config to the bottom
export const dynamic = "force-dynamic";