"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { auth } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import toast from "react-hot-toast";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Email signup
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success("Account created successfully 🎉");
      router.push("/");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Google signup
  const handleGoogleSignup = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success("Welcome to ExamShelf 🚀");
      router.push("/");
    } catch (err: any) {
      toast.error("Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">

      {/* Glow */}
      <div className="absolute inset-0 -z-10 flex justify-center">
        <div className="w-[600px] h-[600px] bg-purple-600/20 blur-[160px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-3xl bg-[#020617]/90 border border-white/10 backdrop-blur-xl p-10 shadow-2xl shadow-purple-600/20"
      >
        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Create your account
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            Start your focused exam preparation journey
          </p>
        </div>

        {/* Google Button */}
        <button
          onClick={handleGoogleSignup}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-white text-black font-medium hover:bg-gray-200 transition"
        >
          <img src="/google.svg" alt="google" className="w-5 h-5" />
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6 text-gray-500 text-sm">
          <div className="flex-1 h-px bg-white/10" />
          or continue with email
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[#020617] border border-white/10 focus:border-purple-500 outline-none"
          />

          <input
            type="password"
            placeholder="Set Password"
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[#020617] border border-white/10 focus:border-purple-500 outline-none"
          />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 font-semibold shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 transition"
          >
            {loading ? "Creating account..." : "Get Started →"}
          </motion.button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-purple-400 hover:text-purple-300 cursor-pointer"
          >
            Sign in
          </span>
        </p>
      </motion.div>
    </main>
  );
}
