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

    // ✅ Admin confirmed → redirect once
    router.replace("/admin/dashboard");

  }, [user, role, loading, router]);

  // prevent UI flash during redirect
  return null;
}