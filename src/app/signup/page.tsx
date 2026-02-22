"use client";

import { useState, Suspense } from "react"; // Added Suspense
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { auth } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import toast from "react-hot-toast";

// --- SIGNUP CONTENT COMPONENT ---
function SignupContent() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
  e.preventDefault();

  if (password !== confirmPassword) {
    toast.error("Passwords do not match");
    return;
  }

  if (password.length < 6) {
    toast.error("Password must be at least 6 characters");
    return;
  }

  try {
    setLoading(true);
    await createUserWithEmailAndPassword(auth, email, password);
    toast.success("Account created successfully 🎉");
    router.push("/");
  } catch (err: any) {
    if (err.code === "auth/email-already-in-use")
  toast.error("Email already registered");
else if (err.code === "auth/weak-password")
  toast.error("Weak password");
else toast.error("Signup failed");
  } finally {
    setLoading(false);
  }
};

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
      {/* Immersive Glow Background */}
      <div className="absolute inset-0 -z-10 flex justify-center">
        <div className="w-[800px] h-[800px] bg-purple-600/10 blur-[160px] rounded-full animate-pulse" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md rounded-[2.5rem] bg-[#020617]/90 border border-white/10 backdrop-blur-2xl p-10 shadow-2xl shadow-purple-900/20"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black tracking-tight text-white leading-tight">
            Join ExamShelf
          </h1>
          <p className="text-gray-400 mt-3 text-sm font-medium">
            Your gateway to high-performance learning
          </p>
        </div>

        <button
          onClick={handleGoogleSignup}
         disabled={loading || !email || !password || !confirmPassword}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-white text-black font-bold text-sm uppercase tracking-widest hover:bg-gray-200 transition active:scale-95 shadow-xl"
        >
          <img src="/google.svg" alt="google" className="w-5 h-5" />
          Google Access
        </button>

        <div className="flex items-center gap-4 my-8 text-gray-600 text-[10px] font-black uppercase tracking-[0.3em]">
          <div className="flex-1 h-px bg-white/5" />
          Security Check
          <div className="flex-1 h-px bg-white/5" />
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="email"
            placeholder="Institutional Email"
            required
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all text-sm"
          />

          <div className="relative">
  <input
    type={showPass ? "text" : "password"}
    placeholder="Secure Password"
    required
    autoComplete="new-password"
    onChange={(e) => setPassword(e.target.value)}
    className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all text-sm"
  />

  <button
    type="button"
    onClick={() => setShowPass(!showPass)}
    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
  >
    {showPass ? "🙈" : "👁"}
  </button>
</div>

<div className="relative">
  <input
    type={showConfirmPass ? "text" : "password"}
    placeholder="Confirm Password"
    required
    onChange={(e) => setConfirmPassword(e.target.value)}
    className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all text-sm"
  />

  <button
    type="button"
    onClick={() => setShowConfirmPass(!showConfirmPass)}
    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
  >
    {showConfirmPass ? "🙈" : "👁"}
  </button>
</div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading || !email || !password || !confirmPassword}
            className="w-full py-4 mt-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 font-black text-white text-xs uppercase tracking-widest shadow-2xl shadow-purple-600/20 hover:shadow-purple-600/40 transition-all"
          >
            {loading ? "Authenticating..." : "Establish Account →"}
          </motion.button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-8 font-medium">
          Already verified?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-purple-400 hover:text-purple-300 cursor-pointer font-bold border-b border-purple-400/30 pb-0.5"
          >
            Sign In
          </span>
        </p>
      </motion.div>
    </main>
  );
}

// --- MAIN BUILD-SAFE EXPORT ---
export default function SignupPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-[#020617]" />}>
      <SignupContent />
    </Suspense>
  );
}

export const dynamic = "force-dynamic";