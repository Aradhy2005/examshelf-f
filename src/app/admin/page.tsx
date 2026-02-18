"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AdminPage() {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // 🔐 Not logged in
    if (!user) {
      router.replace("/login");
      return;
    }

    // 🚫 Not admin
    if (role !== "admin") {
      router.replace("/");
      return;
    }

    // ✅ Admin confirmed → go to dashboard
    router.replace("/admin/dashboard");

  }, [user, role, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <p className="text-gray-400">Loading admin dashboard…</p>
    </div>
  );
}
